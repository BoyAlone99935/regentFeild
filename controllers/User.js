const {StatusCodes} = require('http-status-codes')
const {BadRequestError} = require('../ErrorHandlers/index')
const User = require('../models/user')


const getCurrentUserDetails = async (req , res) => {
  const userId = req.user.userId
  if (!userId) {
    throw new BadRequestError('user not authenthicated')
  }
  const user = await User.findById(userId).select("-password")
  if (!user) {
    throw new BadRequestError('could not find user')
  }
  res.status(StatusCodes.OK).json({user})
}




const updateUser = async (req, res) => {
  const userId = req.user.userId;
  const { name, email} = req.body;
  const image = req.file ? req.file.path : null

  // Only update fields provided
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email , profilePicture : image},
    { new: true, runValidators: true }
  ).select("-password");

  res.status(StatusCodes.OK).json({ user: updatedUser });
};






module.exports = {
  updateUser,
  getCurrentUserDetails
}