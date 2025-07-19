const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT_ERROR: 409,
};

const sendErrorCode = (req, res, error) => {
  if (error.code && error.code === 11000) {
    res.status(STATUS_CODES.CONFLICT_ERROR).json({message: `Email address is already being used: ${error.message}`})
    return
  }

  switch (error.name) {
    case "ValidationError":
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: `Error when validating fields` });
      break;
    case "CastError":
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: `Invalid value given` });
      break;
    case "DocumentNotFoundError":
      res.status(STATUS_CODES.NOT_FOUND).json({
        message: `User with id of ${req.params.userId} was not found`,
      });
      break;
    case 'UnauthorizedError':
      res.status(STATUS_CODES.UNAUTHORIZED)
      .json({message: `Authorization failed`})
      break
    default:
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: `Internal server error` });
  }
};

module.exports = {
  STATUS_CODES,
  sendErrorCode,
};
