const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {PORT=3000} = process.env;
const NotFound = require('./errors/NotFound');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
	req.user = {
		_id: '63710580aac5ba86b011e046' // _id пользователя
	};
	next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use(function(req,res){
  const error = new NotFound(`Такой страницы не существует`)
  res.status(error.statusCode).send({message: error.message});
});
app.listen(PORT);
