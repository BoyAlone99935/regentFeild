const customApiError = require('../ErrorHandlers/CustomApiError')

const ErrorHandler = (err, req, res, next)  => {
  console.log(err)

  if (err instanceof customApiError ) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  return res.status(500).json({ success: false, message: "Internal Server Error" });
}

module.exports = ErrorHandler
