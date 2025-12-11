const jwt = require('jsonwebtoken')
const {unAuthorized} = require('../ErrorHandlers/index')
require('dotenv').config()
const authenthicationMiddleware = async (req , res , next) => {
  try {
    const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new unAuthorized('Authenthication invalid')
  }

  const token = authHeader.split(" ")[1]
  const payload = jwt.verify(token , process.env.JWT_SECRET)
  req.user = {
    userId: payload.userId,
    email: payload.email,
    AccountNumber : payload.AccountNumber
  };
  next()
}
 catch(err) {
    console.log(err)
    throw new unAuthorized("Invalid token");
  }
}


module.exports = authenthicationMiddleware