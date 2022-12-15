// Импорты
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Пакет для хэширование пароля
const Unauthorized = require('../errors/Unauthorized');
const { patternUrl, patternEmail } = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    match: patternUrl,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    match: patternEmail,
  },
  password: {
    required: true,
    type: String,
    select: false, // запретили возвращать пароль
  },
});

// Кастомные методы
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // Ищем пользователя по email, т.к. он уникален и через .select забираем пароль
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password) // Рашифровываем пароль
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль')); // Если пароли не совпали, то выдаем ошибку
          }

          return user; // теперь user доступен
        });
    });
};

// Экспорты
module.exports = mongoose.model('user', userSchema);
