const escape = require('escape-html');

module.exports.replaceMnemonics = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (key !== 'password') { // линт ругается
      req.body[key] = escape(req.body[key]);
    }
  });
  Object.keys(req.body).forEach((key) => {
    if (key === 'id' || key === 'cardId') { // линт ругается
      req.params[key] = escape(req.params[key]);
    }
  })
  next();
};
