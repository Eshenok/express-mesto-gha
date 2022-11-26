const routerCard = require('express').Router();
const {
  getCards, removeLikeCard, likeCard, createCard, removeCard,
} = require('../controllers/cards');

routerCard.get('/', getCards);
routerCard.post('/', createCard);
routerCard.delete('/:cardId', removeCard);
routerCard.put('/:cardId/likes', likeCard);
routerCard.delete('/:cardId/likes', removeLikeCard);

module.exports = routerCard;
