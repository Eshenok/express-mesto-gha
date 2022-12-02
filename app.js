require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { replaceMnemonics } = require('./middlewares/replaceMnemonics');

const app = express();
const { PORT = 3000, CONNECT_DB, NODE_ENV } = process.env;
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? CONNECT_DB : 'mongodb://localhost:27017/mestodb');

// security
app.use(limiter);
app.use(helmet());

app.use(cookieParser());
app.use(replaceMnemonics);
app.use('/', require('./routes/index'));
app.use(require('./errors/centralErrorHandling'));

app.listen(PORT);
