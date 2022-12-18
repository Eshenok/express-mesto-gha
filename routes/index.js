// Корневой роутер, в него подключаем всю маршрутизацию

// Испорты
const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate'); // Пакет для валидации
const { createAccountLimiter } = require('../middlewares/limiter');
const routerUser = require('./users');
const routerCard = require('./cards');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const { login, logout, createUser } = require('../controllers/users');
const { patternUrl } = require('../constants');
const { requestLogger, errorLogger } = require('../middlewares/logger');

// Логи запросов
router.use(requestLogger);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', createAccountLimiter, celebrate({ // подключили как мидл createAccountLimiter
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(patternUrl),
  }),
}), createUser);

router.use(auth); // все что ниже защищено мидлверой
router.get('/logout', logout);
router.use('/cards', routerCard);
router.use('/users', routerUser);

// Логи ошибок
router.use(errorLogger);

// Ошибки celebrate
router.use(errors({
  message: 'Введены некорректные данные',
}));

// обработчик 404 not found
router.use((req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

// Экспорты
module.exports = router;
