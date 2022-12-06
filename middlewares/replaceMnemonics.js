const escape = require('escape-html');

module.exports.replaceMnemonics = (req, res, next) => {
  for (const key in req.body) {
    if (key !== 'password') { // линт ругается
      req.body[key] = escape(req.body[key]);
    }
  }
  for (const key in req.params) {
    if (key === 'id' || key === 'cardId') { // линт ругается
      req.params[key] = escape(req.params[key]);
    }
  }
  next();
};
