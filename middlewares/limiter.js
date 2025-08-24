const rateLimit  = require("express-rate-limit");
const {
  TooManyRequestsError,
} = require("../utils/errors/TooManyRequestsError");

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  handler: (req, res, next) => {
    next(new TooManyRequestsError("Rate limit has been met"))
  },
  legacyHeaders: false,
  standardHeaders: true,
});
