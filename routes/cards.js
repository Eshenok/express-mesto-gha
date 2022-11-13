const router = require('express').Router();
const {getCards, dislikeCard, likeCard} = require('../controllers/cards')

router.get('/', getCards);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;