// импорты
require('dotenv').config(); // обращение к файлу .env
const express = require('express');
const mongoose = require('mongoose'); // mongodb
const cookieParser = require('cookie-parser');
const cors = require('cors');
// расшифорвка кук
const { PORT = 2020, CONNECT_DB, NODE_ENV } = process.env; // Забираем из .env
const helmet = require('helmet'); // пакет helmet (security)
const { replaceMnemonics } = require('./middlewares/replaceMnemonics'); // middleware для замены спецсимволов на мнемоники
const { limiter } = require('./middlewares/limiter'); // middleware для ограничения кол-ва запрос с 1 ip

// константы
const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://voloshin.eshenok.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options)); // ПЕРВЫМ!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? CONNECT_DB : 'mongodb://localhost:27017/mestodb');

// security
app.use(limiter);
app.use(helmet());

// Распаковка кук
app.use(cookieParser());

// Подастановка мнемоник escapeHTML
app.use(replaceMnemonics);

// Роуты
app.use('/', require('./routes/index'));

// Центральный обработчик ошибок
app.use(require('./errors/centralErrorHandling'));

app.listen(PORT);
