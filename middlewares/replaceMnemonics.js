const escape = require('escape-html');

module.exports.replaceMnemonics = (req, res, next) => {
  for (let key in req.body) {
    if (key === 'password') {
      continue;
    }
    req.body[key] = escape(req.body[key]);
  }
  for (let key in req.params) {
    req.params[key] = escape(req.params[key]);
  }
  next();
}