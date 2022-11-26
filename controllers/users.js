const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

module.exports.getUsers = (req, res, next) => {
  User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
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
  const { name, about, avatar} = req.body;
  bcrypt.hash(req.body.password, 10) //hash пароля
    .then(hash => User.create({ //если все "ок", то создаем юзера
      email: req.body.email,
      password: hash,
      name, about, avatar, //либо данные из body либо возьмет default из схемы
    }))
    .then((user) => res.send({ data: user })) //вернем данные назад
    .catch(next)
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
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
  const { avatar } = req.body;
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

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({_id: user._id}, 'seckey', {expiresIn: '7d'})
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, // 7 дней срок
        httpOnly: true,  // из js закрыли доступ
        sameSite: true, // посылать если запрос сделан с того же домена
      });
      res.send(user);
    }).catch(next);
};
