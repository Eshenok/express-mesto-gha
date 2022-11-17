const router = require('express').Router();
const {
  getCards, removeLikeCard, likeCard, createCard, removeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', removeCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;
