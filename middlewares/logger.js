const winston = require('winston'); // Пакет для логгера
const expressWinston = require('express-winston'); // Еще 1 пакет для логгера

// Логи запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }), // все req передаем в файл
  ],
  format: winston.format.json(), // формат в котором будет лог
});

// Логи ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }), // все error передаем в файл
  ],
  format: winston.format.json(),
});

// экспорты
module.exports = {
  requestLogger,
  errorLogger,
};
