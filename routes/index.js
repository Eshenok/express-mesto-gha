const router = require('express').Router();
const routerUser = require('./users');
const routerCard = require('./cards');
const auth = require('../middlewares/auth')
const NotFound = require('../errors/NotFound');
const {login, createUser} = require('../controllers/users');
const {celebrate, Joi, errors} = require('celebrate');

router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), login);
router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
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

