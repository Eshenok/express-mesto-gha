const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', require('./routes/index'));

//Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const {statusCode = 500, message} = err;
  res.status(statusCode).send({message: statusCode === 500 ? 'Eternal error' : message});
})

app.listen(PORT);
