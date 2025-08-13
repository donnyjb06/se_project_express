const errorHandler = (error, req, res, next) => {
  console.error(error)
  const {statusCode, message} = error;

  res
    .status(statusCode)
    .json({
      message: statusCode === 500
      ? "An unknown error has occured on the server"
      : message
    })
}

module.exports = errorHandler = errorHandler