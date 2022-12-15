const escape = require('escape-html'); // Пакет для замены спецсимволов на мнемоники

module.exports.replaceMnemonics = (req, res, next) => {
  // Замена для body
  Object.keys(req.body).forEach((key) => { // Проходимся по всем ключам в объекте
    if (key !== 'password') {
      req.body[key] = escape(req.body[key]); // Заменяем все поля кроме password
    }
  });

  // Замена для params
  Object.keys(req.body).forEach((key) => {
    if (key === 'id' || key === 'cardId') {
      // Меняем только для id и cardId, остальные будут в первозданном виде
      req.params[key] = escape(req.params[key]);
    }
  });
  next();
};
