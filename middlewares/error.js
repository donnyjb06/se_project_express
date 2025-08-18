const errorHandler = (err, req, res, next) => {
  const {statusCode, message} = err;

  res
    .status(statusCode)
    .json({
      message: statusCode === 500
      ? "An unknown error has occured on the server"
      : message
    })
}

module.exports = {
  errorHandler
}