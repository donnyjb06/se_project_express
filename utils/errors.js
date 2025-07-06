const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDED: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const sendErrorCode = (req, res, error) => {
  switch (error.name) {
    case "ValidationError":
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: `Error when validating fields: ${error.message}` });
      break;
    case "CastError":
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: `Invalid value given: ${error.message}` });
      break;
    case "DocumentNotFoundError":
      res
        .status(ERROR_CODES.NOT_FOUND)
        .json({
          message: `User with id of ${req.params.userId} was not found: ${error.message}`,
        });
      break;
    default:
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .json({ message: `Internal server error: ${error.message}` });
  }
};

module.exports = {
  ERROR_CODES, sendErrorCode
}