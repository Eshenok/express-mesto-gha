const routerUser = require('express').Router();
const {
  getUser, getUsers, updateUser, updateUserAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/:id', getUser);
routerUser.patch('/me', updateUser);
routerUser.patch('/me/avatar', updateUserAvatar);

module.exports = routerUser;
