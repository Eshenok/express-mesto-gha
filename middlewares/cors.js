// const allowedOrigin = ["https://voloshin.eshenok.nomoredomains.club", "localhost:3000"];
// // allowedOrigin.includes(origin)
// module.exports = function(req, res, next) {
//   const { origin } = req.headers;
//       res.header("Access-Control-Allow-Origin", origin);
//       res.header("Access-Control-Allow-Credentials", "true");
//       res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, origin, Authorization");
//       res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//       res.header("Access-Control-Max-Age", 86400);
//       next();
// }