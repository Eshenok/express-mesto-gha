const routerUser = require('express').Router();
const {
  getUser, getUsers, updateUser, updateUserAvatar, getCurrentUser
} = require('../controllers/users');
const {celebrate, Joi} = require('celebrate');

routerUser.get('/', getUsers);
routerUser.get('/me', getCurrentUser);
routerUser.get('/:id', getUser);
routerUser.patch('/me',celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  })
}) , updateUser);
routerUser.patch('/me/avatar',celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))*/), //паттерн для url
  })
}) , updateUserAvatar);

module.exports = routerUser;
