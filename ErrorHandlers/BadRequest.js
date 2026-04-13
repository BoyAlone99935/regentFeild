const {StatusCodes} = require('http-status-codes')
const customApiError = require('../ErrorHandlers/CustomApiError')

class BadRequestError extends customApiError {
  constructor (message) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

module.exports = BadRequestError