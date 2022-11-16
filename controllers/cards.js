const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const {NOT_FOUND, NOT_VALID, SERVER_ERROR} = require('../constatnts');

module.exports.getCards = (req, res) => {
	Card.find({}).populate('owner')
		.then(cards => res.send({data: cards}))
		.catch(err => res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message}));
}

module.exports.createCard = (req, res) => {
	const {name, link} = req.body;
	Card.create({name, link, owner: req.user._id})
		.then(card => res.send({data: card}))
		.catch((err) => {
      if (err.name === "ValidationError") {
        res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message})
        return;
      }
      res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message})
    })
}

module.exports.removeCard = (req, res) => {
	Card.findByIdAndRemove(req.params.cardId).populate('owner')
    .orFail(() => {
      throw new NotFound(`Карточка с id: ${req.params.cardId} - не найдена`);
    })
		.then(card => res.send(card))
		.catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({message: err.message});
        return;
      } else if (err.name === 'CastError') {
        res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message});
        return;
      }
      res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message});
    })
}

module.exports.likeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{$addToSet: {likes: req.user._id}}, // добавить _id в массив, если его там нет
		{new: true},
	).populate('owner')
    .orFail(() => {
      throw new NotFound(`Карточка с id: ${req.params.cardId} - не найдена`);
    })
		.then(card => res.send({data: card}))
		.catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({message: err.message});
        return;
      } else if (err.name === 'CastError') {
        res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message});
        return;
      }
      res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message});
    })
}

module.exports.removeLikeCard = (req, res) => {
	Card.findByIdAndUpdate(
		req.params.cardId,
		{$pull: {likes: req.user._id}}, // убрать _id из массива
		{new: true},
	).populate('owner')
    .orFail(() => {
      throw new NotFound(`Карточка с id: ${req.params.cardId} - не найдена`);
    })
		.then(card => res.send({data: card}))
		.catch((err) => {
      if (err.statusCode === 404) {
        res.status(NOT_FOUND.statusCode).send({message: err.message});
        return;
      } else if (err.name === 'CastError') {
        res.status(NOT_VALID.statusCode).send({message: NOT_VALID.message});
        return;
      }
      res.status(SERVER_ERROR.statusCode).send({message: SERVER_ERROR.message});
    })
}