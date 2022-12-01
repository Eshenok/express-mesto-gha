const escape = require('escape-html');
const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const name = escape(req.body.name);
  const link = escape(req.body.link);

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.removeCard = (req, res, next) => {
  const id = escape(req.params.cardId);

  Card.findById(id)
    .orFail(() => {
    throw new NotFound('Карточка не найдена');
  })
    .then((card) => {
      try {
        if (card.owner == req.user._id) {
          Card.findByIdAndRemove(id)
            .then((card) => {
              res.send({ data: card });
            }).catch(next)
            ;
        } else {
          throw new Forbidden('Невозможно удалить чужую карточку')
        }
      } catch {
        throw new Error('Internal error')
      }
    }).catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные'));
    } else {
      next(err);
    }
  })
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
