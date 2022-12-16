/*
 * celebrate используем для валидации, чтобы лишний раз не нагружать БД
 * Для id используем длину в 24 символа и hex
 */

// Импорты
const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');
const { patternUrl } = require('../constants');

routerUser.get('/', getUsers);
routerUser.get('/me', getCurrentUser);
routerUser.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUser);
routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(patternUrl),
  }),
}), updateUserAvatar);

// Экспорты
module.exports = routerUser;
