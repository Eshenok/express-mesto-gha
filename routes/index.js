const router = require('express').Router();
const routerUser = require('./users');
const routerCard = require('./cards');
const auth = require('../middlewares/auth')
const NotFound = require('../errors/NotFound');
const {login, createUser} = require('../controllers/users');
const cookieParser = require('cookie-parser');


router.use('/signin', login);
router.use('/signup', createUser);
router.use(cookieParser())
router.use(auth); //все что ниже защищено мидлверой
router.use('/cards', routerCard);
router.use('/users', routerUser);

router.use((req, res) => { //обработчик 404 not found
  const error = new NotFound('Такой страницы не существует');
  res.status(error.statusCode).send({ message: error.message });
});

module.exports = router;

