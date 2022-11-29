const routerCard = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, removeLikeCard, likeCard, createCard, removeCard,
} = require('../controllers/cards');

routerCard.get('/', getCards);
routerCard.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))*/),
  }),
}), createCard);
routerCard.delete('/:cardId', removeCard);
routerCard.put('/:cardId/likes', likeCard);
routerCard.delete('/:cardId/likes', removeLikeCard);

module.exports = routerCard;
