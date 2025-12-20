const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type : {
    type : String,
    enum : ['Credit' , 'Debit'],
    required : true
  },
  method : {
    type : String,
    enum : ['Transfer' , 'Deposit' , 'Withdrawal'],
    required : true
  },
  amount : {
    type : Number,
    required : true
  },
  userId : { 
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },
  beneficiary : {
    type : String,
    required : true
  },
  beneficiaryInstitution : {
   type : String
  },
  source : {
    type : String
  },
  sourceInstitution : {
    type : String,
    required : true
  },
  before : {
    type : Number
  },
  after : {
    type : Number
  },
  senderAcct : {
    type: Number
  }
},{ timestamps: true }) 

module.exports = mongoose.model('Transaction', TransactionSchema)