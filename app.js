const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {PORT=3000} = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

app.use((req, res, next) => {
	req.user = {
		_id: '63710580aac5ba86b011e046' // _id пользователя
	};

	next();
});

app.listen(PORT, () => {
	console.log('ЕЕЕЕБОИИИ1')
});
