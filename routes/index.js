const router = require('express').Router();
const routerUser = require('./users');
const routerCard = require('./cards');
const auth = require('../middlewares/auth')
const NotFound = require('../errors/NotFound');
const {login, createUser} = require('../controllers/users');
const {celebrate, Joi, errors} = require('celebrate');
const rateLimit = require('express-rate-limit');

const createAccountLimiter = rateLimit({ //лимит на создание пользователей
  windowMs: 30 * 30 * 1000, // 30 минут
  max: 10, // максимум 10
  message:
    'Too many request',
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), login);

router.post('/signup', createAccountLimiter, celebrate({ // подключили как мидл createAccountLimiter
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))*/)
  })
}), createUser);
router.use(auth); //все что ниже защищено мидлверой
router.use('/cards', routerCard);
router.use('/users', routerUser);

// Ошибки celebrate
router.use(errors({
  message: 'Введены некорректные данные',
}));

//обработчик 404 not found
router.use((req, res) => {
  const error = new NotFound('Такой страницы не существует');
  res.status(error.statusCode).send({ message: error.message });
});

module.exports = router;

