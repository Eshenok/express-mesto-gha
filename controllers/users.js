// Импорты
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Пакет для создания jwt
const escape = require('escape-html'); // Пакет для замены спецсимволов на мнемоники
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const { productionSecurityKey } = require('../constants');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  bcrypt.hash(req.body.password, 10) // hash пароля
    .then((hash) => User.create({ // если все "ок", то создаем юзера
      email: escape(req.body.email),
      password: hash,
      name,
      about,
      avatar, // либо данные из body либо возьмет default из схемы
    }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с такой почтой уже существует'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    // Сработает только если удалить пользователя из БД,
    // тогда токен пропустит, но тут не сможет найти в db такого юзера
    // В auth нельзя иначе будет слишком много запросов к БД
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;

  User.findUserByCredentials(email, password) // кастомный метод
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : productionSecurityKey, { expiresIn: '7d' }); // Создаем токен
      res.cookie('jwt', token, { // Передаем токен юзеру
        maxAge: 3600000 * 24 * 7, // 7 дней срок
        httpOnly: true, // из js закрыли доступ
        sameSite: true, // посылать если запрос сделан с того же домена
      });
      const userObj = user.toObject(); // Переводим JSON в jsобъект и удаляем поле пароля
      delete userObj.password;
      res.send(userObj);
    }).catch(next);
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: true,
  });
  res.send({ message: 'Complete' });
};
