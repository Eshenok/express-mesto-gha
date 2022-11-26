const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized')

module.exports = (req, res, next) => {
  const token = req.cookies.jwt; //Достаем токен
  if(!token) {
    next(new Unauthorized('Необходимо авторизоваться'))
  }

  let payload;
  try {
    payload = jwt.verify(token, 'seckey'); //верифицируем токен
  } catch (err) {
    next(new Unauthorized('Необходимо авторизоваться')) //не получилось -> ошибка
  }

  req.user = payload; // записываем пейлод в юзера
  next(); //пропускаем дальше
}