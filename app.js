const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;
const NotFound = require('./errors/NotFound');

//Parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

//Мидлвэр для id юзера (временно)
app.use((req, res, next) => {
  req.user = {
    _id: '63710580aac5ba86b011e046', // _id пользователя
  };
  next();
});

//Роуты до users и cards
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

//Обработчик несуществующей страницы
app.use((req, res) => {
  const error = new NotFound('Такой страницы не существует');
  res.status(error.statusCode).send({ message: error.message });
});

//Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const {statusCode = 500, message} = err;
  res.status(statusCode).send({message: statusCode === 500 ? 'Eternal error' : message});
})
app.listen(PORT);
