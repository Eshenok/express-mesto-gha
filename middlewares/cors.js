module.exports = function() {
  return function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000, https://voloshin.eshenok.nomoredomains.club");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, origin, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Max-Age", 86400)
    res.status(200);
    next();
  };
}