const { BadRequestError } = require('../ErrorHandlers/index')
const {StatusCodes} = require('http-status-codes')
const Transaction = require('../models/Transaction')
const Notification = require('../models/Notification')
const user = require('../models/user')
const Beneficiary = require('../models/Beneficiary')
function maskAccountNumber(accountNumber) {
  const accountStr = String(accountNumber);
  return accountStr.slice(-4).padStart(accountNumber.length, '*');
}
const TransferFunds = async (req , res) => {
  const type = 'Debit'
  const userId = req.user.userId
  const method = 'Transfer'
  const {amount , beneficiary , beneficiaryInstitution , source , sourceInstitution , myAccountNumber , senderAccountNumber , before , after , logo } = req.body
  const newBal = parseFloat(req.body.newBal)
  console.log(newBal)
  if (!amount || !beneficiary || !beneficiaryInstitution || !source || !sourceInstitution) {
    throw new BadRequestError('please enter all transfer details to continue')
  }

  if (!myAccountNumber) {
    throw new BadRequestError('your account number not present')
  }

  if (!senderAccountNumber) {
    throw new BadRequestError('recipient account number not present')
  }

  const details = await Transaction.create({
    type,
    method,
    amount,
    userId,
    beneficiary,
    beneficiaryInstitution,
    source,
    sourceInstitution,
    before,
    after
  })

    const UserBal = await user.findByIdAndUpdate(
    userId,
    { $set: { AccountBalance: newBal} },
    { new: true }
    );
  
  const notification = await Notification.create({
    userId,
    type,
    message: `your account ****${maskAccountNumber(myAccountNumber)}  was debited $${amount.toLocaleString()} for TRANSFER TO ${beneficiary.toUpperCase()} ${beneficiaryInstitution} ${maskAccountNumber(senderAccountNumber)}`
  })
  
    const exists = await Beneficiary.exists({
      name: beneficiary,
      bank: beneficiaryInstitution,
      accountNumber: senderAccountNumber
    });

    if (exists) {
     console.log('beneficiary exists')
    } else {
    const createBeneficiary = await Beneficiary.create({
    userId,
    accountNumber : senderAccountNumber,
    bank : beneficiaryInstitution,
    name : beneficiary,
    logo : logo
    })
    console.log('new beneficiary added')
    }
  res.status(StatusCodes.CREATED).json({details , newBal,  msg : 'notification generated, new balance updated ' })
} 

const getAllTransactions = async (req , res) => {
  const userId = req.user.userId
  if (!userId) {
  throw new BadRequestError('user id not present')}
  const allTransactions = await Transaction.find({userId : userId}).sort({ createdAt: -1 })
  res.status(StatusCodes.OK).json({allTransactions})
}



const getAllNotification = async (req , res) => {
  const userId = req.user.userId 
  if (!userId) {
    throw new BadRequestError('user id not present')
  }
  
  const AllNotification = await Notification.find({userId : userId}).sort({ createdAt: -1 })
  res.status(StatusCodes.OK).json({AllNotification})
}


const getAllBeneficiaries = async (req, res) => {
  const userId = req.user.userId
   if (!userId) {
    throw new BadRequestError('user id not present')
  }
  console.log('fetching beneficaries')
  const AllBeneficiaries = await Beneficiary.find({userId: userId}).sort({ createdAt: -1 })
  res.status(StatusCodes.OK).json({AllBeneficiaries})
}
module.exports = {
  TransferFunds,
  getAllTransactions,
  getAllNotification,
  getAllBeneficiaries
}