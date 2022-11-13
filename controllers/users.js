const User = require('../models/user');

module.exports.getUser = (req, res) => {
	User.findById(req.params.id)
		.then(user => res.send({data: user}))
		.catch(err => res.status(500).send({message: err.message}))
}

module.exports.getUsers = (req, res) => {
	User.find({})
		.then(users => res.send({data: users}))
		.catch(err => res.status(500).send({message: err.message}))
}

module.exports.createUser = (req, res) => {
	const {name, about, avatar} = req.body;
	User.create({name, about, avatar})
		.then(user => res.send({data: user}))
		.catch(err => res.status(500).send({message: err.message}))
}

module.exports.updateUser = (req, res) => {
	const {name, about} = req.body;
	User.findByIdAndUpdate(req.params.id, {name, about})
		.then(user => res.send({data: user}))
		.catch(err => res.status(500).send({message: err.message}))
}

module.exports.updateUserAvatar = (req, res) => {
	const {avatar} = req.body;
	User.findByIdAndUpdate(req.params.id, {avatar})
		.then(user => res.send({data: user}))
		.catch(err => res.status(500).send({message: err.message}))
}