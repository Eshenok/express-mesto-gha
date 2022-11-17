const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const { NOT_FOUND, NOT_VALID, SERVER_ERROR } = require('../constatnts');

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({ message: err.message });
        return
      } else if (err.name === 'CastError') {
        res.status(NOT_VALID.statusCode).send({ message: NOT_VALID.message });
        return
      }
      res.status(SERVER_ERROR.statusCode).send({ message: SERVER_ERROR.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR.statusCode).send({ message: SERVER_ERROR.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID.statusCode).send({ message: NOT_VALID.message });
        return;
      }
      res.status(SERVER_ERROR.statusCode).send({ message: SERVER_ERROR.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => {
      throw new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({ message: err.message });
        return
      } else if (err.name === 'CastError') {
        res.status(NOT_VALID.statusCode).send({ message: NOT_VALID.message });
        return
      }
      res.status(SERVER_ERROR.statusCode).send({ message: SERVER_ERROR.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({ message: err.message });
        return
      } else if (err.name === 'CastError') {
        res.status(NOT_VALID.statusCode).send({ message: NOT_VALID.message });
        return
      }
      res.status(SERVER_ERROR.statusCode).send({ message: SERVER_ERROR.message });
    });
};
