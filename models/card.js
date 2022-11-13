const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 2,
		maxLength: 30,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	likes: {
		type: Array,
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	}
});

module.exports = mongoose.model('card', cardSchema);