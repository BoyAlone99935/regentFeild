// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    select: false, // do not return password by default
  },
  AccountNumber: {
    type : Number,
  },
  profilePicture: {
    type : String,
    default : null
  },
  AccountBalance: {
    type: Number,
    default: 0.00,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please provide date of birth"],
  },
  address: {
    type: String,
    required: [true, "Please provide address"], 
  },
  phone: {
    type: String, 
  },
  transferPin: {
    type: String,
  },
  loginCode : {
    type: String,
    select: false,
  },
  inMonth : {
    type : Number,
    default : 0.00
  },
   inWeek : {
    type : Number,
    default : 0.00
  },
  outMonth : {
    type : Number,
    default : 0.00
  },
  outWeek : {
    type : Number,
    default : 0.00
  },
  limit : {
    type : Number
  },
  kycLevel : {
    type : Number,
    default: 1
  },
  transfer: { type: Boolean, default: true }
}, { timestamps: true });


UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


UserSchema.statics.generateAccountNumber = async function() {
  let number;
  let exists = true;

  while (exists) {
    number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    exists = await this.findOne({ AccountNumber: number });
  }

  return number;
};



UserSchema.statics.generateLoginCode = async function () {
  let number;
  let exists = true;

  while (exists) {
    number = Math.floor(10000 + Math.random() * 90000).toString();
    exists = await this.findOne({ loginCode: number });
  }

  return number;
};


module.exports = mongoose.model('User', UserSchema);
