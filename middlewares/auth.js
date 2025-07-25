const jwt = require("jsonwebtoken");
const { sendErrorCode } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const extractToken = (header) => header.split("Bearer ")[1].trim();

const authenticateUser = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    const error = new Error("Missing or invalid header");
    error.name = "UnauthorizedError";
    sendErrorCode(res, error);
  }

  const extractedToken = extractToken(authorization);

  try {
    const payload = jwt.verify(extractedToken, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    error.name = "UnauthorizedError";
    sendErrorCode(res, error);
  }
};

module.exports = {
  authenticateUser,
};
