const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const {PORT=3000, BASE_PATH} = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
	req.user = {
		_id: '63710580aac5ba86b011e046' // _id пользователя
	};
	next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
	console.log('Ссылка на сервер');
	console.log(BASE_PATH);
});
