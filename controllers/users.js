require('dotenv').config();
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const escape = require('escape-html');
const {JWT_SECRET} = process.env

module.exports.getUsers = (req, res, next) => {
  User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => res.send({data: user}))
    .catch(next)
}

module.exports.getUser = (req, res, next) => {
  const id = escape(req.params.id);
  User.findById(id)
    .orFail(() => {
      throw new NotFound(`Пользователь с id: ${id} - не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err)
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const name = escape(req.body.name);
  const about = escape(req.body.about);
  const avatar = escape(req.body.avatar);
  bcrypt.hash(req.body.password, 10) //hash пароля
    .then(hash => User.create({ //если все "ок", то создаем юзера
      email: req.body.email,
      password: hash,
      name, about, avatar, //либо данные из body либо возьмет default из схемы
    }))
    .then((user) => res.send({ data: user })) //вернем данные назад
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с такой почтой уже существует'))
      } else {
        next(err);
      }
    })
};

module.exports.updateUser = (req, res, next) => {
  const name = escape(req.body.name);
  const about = escape(req.body.name);
  if (!name && !about) { // что-то обновить обязательно
    next(new BadRequest('Запрос не может быть пустой'));
  }
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const avatar = escape(req.body.avatar);
  if (!avatar) { //есть ли данные в теле
    next(new BadRequest('Запрос не может быть пустой'));
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFound(`Пользователь с id: ${req.user._id} - не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;
  User.findUserByCredentials(email, password) //кастомный метод
    .then((user) => {
      const token = jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: '7d'})
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, // 7 дней срок
        httpOnly: true,  // из js закрыли доступ
        sameSite: true, // посылать если запрос сделан с того же домена
      });
      res.send(user);
    }).catch(next);
};
