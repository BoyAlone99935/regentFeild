const {StatusCodes} = require('http-status-codes')
const {BadRequestError} = require('../ErrorHandlers/index')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()
const login = async (req , res) => {
  const {email , password} = req.body
  if (!email || !password) {
    throw new BadRequestError('please fill all feilds')
  }

  const user = await User.findOne({email}).select('+password')
  if (!user) {
    throw new BadRequestError('incorrect email')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new BadRequestError("incorrect password")
  }

  const payload = {
    userId: user._id,
    email: user.email,
    AccountNumber : user.AccountNumber
  }
  const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : process.env.JWT_LIFETIME})
  
  res.status(StatusCodes.OK).json({user , token})
}

const signUp = async (req , res) => {
  console.log(req.body)
  const { email , password ,firstName , lastName , dateOfBirth ,  address ,  pin , phone } = req.body
  if (!firstName || !lastName || !email || !password || !dateOfBirth || !address || !pin || !phone) {
    throw new BadRequestError('please provide all values')
  }
  const profileImageUrl = req.file ? req.file.path : null;
  console.log("REQ.FILE:", req.file);
  console.log("PROFILE URL:", profileImageUrl); 
  const emailExists = await User.findOne({email})
  if (emailExists) {
    throw new BadRequestError("email already exists")
  }
  const AccountNumber = await User.generateAccountNumber()
  const loginCode = await User.generateLoginCode()
  if (!AccountNumber) {
    throw new BadRequestError('failed to generate account number')
  }
  if (!loginCode) {
    throw new BadRequestError('failed to generate log in code')
  }
  const name = firstName + " " + lastName
  const user =  await User.create({name , email , password , dateOfBirth, address, phone, transferPin : pin, AccountNumber, loginCode , profilePicture : profileImageUrl})
  const payload = {
    userId: user._id,
    email: user.email,
    AccountNumber: user.AccountNumber
  }
  
  const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn : process.env.JWT_LIFETIME})
  res.status(StatusCodes.CREATED).json({user , token }) 
}


const compereLoginCode = async (req, res) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    throw new BadRequestError("please provide all values");
  }

  const user = await User.findById(userId).select("+loginCode");
  if (!user) {
    throw new BadRequestError("user not found");
  }

  const cleanDbCode = String(user.loginCode).trim();
  const cleanClientCode = String(code).trim();

  console.log("DB:", cleanDbCode, "CLIENT:", cleanClientCode);

  if (cleanDbCode !== cleanClientCode) {
    throw new BadRequestError("incorrect login code");
  }

 
  const newLoginCode = String(
    Math.floor(Math.random() * 999999)
  ).padStart(6, "0");

  user.loginCode = newLoginCode;
  await user.save(); // <-- no loose update, no race condition

  return res
    .status(StatusCodes.OK)
    .json({ message: "login code matched" });
};



const updateLoginCode = async (req , res) => {
  const userId = req.body.userId
  const newLoginCode = await User.generateLoginCode()
  const user = await User.findByIdAndUpdate(userId , {loginCode : newLoginCode} , {new : true})
  res.status(StatusCodes.OK).json({message : 'login code updated'})
}
module.exports =  {
  login,
  signUp,
  compereLoginCode,
  updateLoginCode
}