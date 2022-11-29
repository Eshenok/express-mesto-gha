require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const app = express();
const { PORT = 3000, CONNECT_DB } = process.env;
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(CONNECT_DB);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100 // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser())
app.use('/', require('./routes/index'));

//Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const {statusCode = 500, message} = err;
  res.status(statusCode).send({message: statusCode === 500 ? 'Eternal error' : message});
})

app.listen(PORT);
