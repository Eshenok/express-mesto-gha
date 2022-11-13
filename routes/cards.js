const router = require('express').Router();
const {getCards} = require('../controllers/cards')

router.get('/', getCards);

module.exports = router;