const routerUser = require('express').Router();
const {
  getUser, getUsers, updateUser, updateUserAvatar, getCurrentUser
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/me', getCurrentUser);
routerUser.get('/:id', getUser);
routerUser.patch('/me', updateUser);
routerUser.patch('/me/avatar', updateUserAvatar);

module.exports = routerUser;
