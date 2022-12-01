const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

const createAccountLimiter = rateLimit({ // лимит на создание пользователей
  windowMs: 30 * 30 * 1000, // 30 минут
  max: 10, // максимум 10
  message:
    'Too many request',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {limiter, createAccountLimiter}