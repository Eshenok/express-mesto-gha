const Card = require('../models/card');

module.exports.getCards = (req, res) => {
	Card.find({})
		.then(cards => res.send({data: cards}))
		.catch(err => res.status(500).send({message: err.message}));
}