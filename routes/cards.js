/*
 * celebrate используем для валидации, чтобы лишний раз не нагружать БД
 * Для cardId используем длину в 24 символа и hex
 */

// Импорты
const routerCard = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, removeLikeCard, likeCard, createCard, removeCard,
} = require('../controllers/cards');
const { patternUrl } = require('../constants');

routerCard.get('/', getCards);

routerCard.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(patternUrl),
  }),
}), createCard);

routerCard.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), removeCard);

routerCard.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

routerCard.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), removeLikeCard);

// Экспорты
module.exports = routerCard;
