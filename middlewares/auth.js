require('dotenv').config();
const jwt = require('jsonwebtoken'); // пакет для создания jwt
const Unauthorized = require('../errors/Unauthorized');
const { productionSecurityKey } = require('../constants');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt; // Достаем токен (с помощью cookieParser он доступен)
  if (!token) {
    next(new Unauthorized('Необходимо авторизоваться')); // Если не нашли токен в куках передаем ошибку
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : productionSecurityKey); // верифицируем токен
  } catch (err) {
    next(new Unauthorized('Необходимо авторизоваться')); // не получилось -> ошибка
    return;
  }

  req.user = payload; // записываем пейлод в юзера
  next(); // пропускаем дальше
};
