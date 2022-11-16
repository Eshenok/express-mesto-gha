const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const {NOT_FOUND, NOT_VALID, SERVER_ERROR} = require('../constatnts');

module.exports.getUser = (req, res, next) => {
	User.findById(req.params.id)
    .orFail(() => {
    const error = new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
    throw error;
  })
    .then(user => res.send({data: user}))
		.catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({message: err.message});
      }else if (err.name = 'CastError'){
        res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message})
      } else {
        res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message})
      }
    });
}

module.exports.getUsers = (req, res) => {
	User.find({})
		.then(users => res.send({data: users}))
		.catch(err => res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message}))
}

module.exports.createUser = (req, res, next) => {
	const {name, about, avatar} = req.body;
	User.create({name, about, avatar})
		.then(user => res.send({data: user}))
		.catch((err) => {
      if (err.name == 'ValidationError') {
        res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message})
        return;
      }
      res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message});
		})
}

module.exports.updateUser = (req, res) => {
	const {name, about} = req.body;
  if (!name || !about) {
    res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message});
    return;
  }
	User.findByIdAndUpdate(req.user._id, {name, about}, {new: true})
    .orFail(() => {
      const error = new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
      throw error;
    })
		.then(user => res.send({data: user}))
		.catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({message: err.message});
      }
      res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message})
    })
}

module.exports.updateUserAvatar = (req, res) => {
	const {avatar} = req.body;
  if (!avatar) {
    res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message});
    return;
  }
	User.findByIdAndUpdate(req.user._id, {avatar}, {new: true})
    .orFail(() => {
      const error = new NotFound(`Пользователь с id: ${req.params.id} - не найден`);
      throw error;
    })
		.then(user => res.send({data: user}))
		.catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({message: err.message});
      }
      res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message});
    })
}