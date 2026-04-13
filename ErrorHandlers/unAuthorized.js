const statusCodes = require('http-status-codes')
const customApiError = require('./CustomApiError')

class unAuthorized extends customApiError {
  constructor (message) {
   super(statusCodes.StatusCodes.UNAUTHORIZED , message)
  }
}

module.exports = unAuthorized

