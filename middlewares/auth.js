const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {UnauthorizedError} = require("../utils/errors/UnauthorizedError")

const extractToken = (header) => header.split("Bearer ")[1].trim();

const authenticateUser = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    const error = new Error("Missing or invalid header");
    error.name = "UnauthorizedError";
    next(new UnauthorizedError("Invalid token"))
    return
  }

  const extractedToken = extractToken(authorization);

  try {
    const payload = jwt.verify(extractedToken, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    error.name = "UnauthorizedError";
    next(new UnauthorizedError("An error has occured when attempting to validate your token"))
  }
};

module.exports = {
  authenticateUser,
};
