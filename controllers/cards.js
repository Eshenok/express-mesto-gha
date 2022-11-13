const Card = require('../models/card');

module.exports.getCards = (req, res) => {
	Card.find({})
		.then(cards => res.send({data: cards}))
		.catch(err => res.status(500).send({message: err.message}));
}

module.exports.likeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
		{new: true},
	)
}

module.exports.dislikeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{$pull: {likes: req.user._id}}, // убрать _id из массива
		{new: true},
	)
}