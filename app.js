require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
const { PORT = 3000, CONNECT_DB, NODE_ENV } = process.env;
const helmet = require('helmet');
const cors = require('cors');
const { replaceMnemonics } = require('./middlewares/replaceMnemonics');
const { limiter } = require('./middlewares/limiter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? CONNECT_DB : 'mongodb://localhost:27017/mestodb');

// security
app.use(limiter);
app.use(helmet());

// cors
const corsOptions = {
  origin: ['http://localhost:3000', 'http://voloshin.eshenok.nomoredomains.club', 'https://voloshin.eshenok.nomoredomains.club'],
  optionsSuccessStatus: 200, // For legacy browser support
  methods: 'GET, PUT, PATCH, POST, DELETE',
};
app.use(cors(corsOptions));

// Распаковка кук
app.use(cookieParser());

// Подастановка мнемоник escapeHTML
app.use(replaceMnemonics);

// Роуты
app.use('/', require('./routes/index'));

// Центральный обработчик ошибок
app.use(require('./errors/centralErrorHandling'));

app.listen(PORT);
