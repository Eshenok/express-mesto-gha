const router = require('express').Router();
const { getUser, getUsers, createUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
