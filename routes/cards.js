const router = require('express').Router();
const {getCards, removeLikeCard, likeCard, createCard} = require('../controllers/cards')

router.get('/', getCards);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', removeLikeCard);

module.exports = router;