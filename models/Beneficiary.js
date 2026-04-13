const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  accountNumber : {
    type : String
  },
  bank : {
    type : String
  },
  name : {
    type : String
  },
  logo : {
    type : String
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  }
})

module.exports = mongoose.model('Beneficiary', BeneficiarySchema)