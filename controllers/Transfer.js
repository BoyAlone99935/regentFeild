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
const TransferFunds = async (req, res) => {
  const type = 'Debit';
  const method = 'Transfer';
  const userId = req.user.userId;

  const {
    amount,
    beneficiary,
    beneficiaryInstitution,
    source,
    sourceInstitution,
    myAccountNumber,
    senderAccountNumber,
    logo,
    desc
  } = req.body;

  // ----------------------------
  // 1. VALIDATION
  // ----------------------------
  if (
    !amount ||
    !beneficiary ||
    !beneficiaryInstitution ||
    !source ||
    !sourceInstitution
  ) {
    throw new BadRequestError('please enter all transfer details to continue');
  }

  if (!myAccountNumber) {
    throw new BadRequestError('your account number not present');
  }

  if (!senderAccountNumber) {
    throw new BadRequestError('recipient account number not present');
  }

  if (!desc) {
    throw new BadRequestError('missing description');
  }

  // ----------------------------
  // 2. TYPE CONVERSION
  // ----------------------------
  const amountNumber = Number(amount);

  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    throw new BadRequestError('Invalid transfer amount');
  }

  // ----------------------------
  // 3. GET USER + BALANCE CHECK
  // ----------------------------
  const currentUser = await user.findById(userId);

  if (!currentUser) {
    throw new BadRequestError('User not found');
  }

  const before = Number(currentUser.AccountBalance);

  if (!Number.isFinite(before)) {
    throw new BadRequestError('Invalid account balance');
  }

  if (before < amountNumber) {
    throw new BadRequestError('Insufficient balance');
  }

  // ----------------------------
  // 4. CALCULATE NEW BALANCE
  // ----------------------------
  const newBalance = before - amountNumber;

  // ----------------------------
  // 5. UPDATE USER BALANCE
  // ----------------------------
  const updatedUser = await user.findByIdAndUpdate(
    userId,
    { $set: { AccountBalance: newBalance } },
    { new: true }
  );

  const after = updatedUser.AccountBalance;

  // ----------------------------
  // 6. TRANSACTION RECORD
  // ----------------------------
  const details = await Transaction.create({
    type,
    method,
    amount: amountNumber,
    userId,
    beneficiary,
    beneficiaryInstitution,
    source,
    sourceInstitution,
    before,
    after,
    senderAcct: senderAccountNumber,
    desc
  });

  // ----------------------------
  // 7. NOTIFICATION
  // ----------------------------
  await Notification.create({
    userId,
    type,
    message: `your account ****${maskAccountNumber(myAccountNumber)} was debited $${amountNumber.toLocaleString()} for TRANSFER TO ${beneficiary.toUpperCase()} ${beneficiaryInstitution} ${maskAccountNumber(senderAccountNumber)}`
  });

  // ----------------------------
  // 8. BENEFICIARY CHECK
  // ----------------------------
  const exists = await Beneficiary.exists({
    name: beneficiary,
    bank: beneficiaryInstitution,
    accountNumber: senderAccountNumber
  });

  if (!exists) {
    await Beneficiary.create({
      userId,
      accountNumber: senderAccountNumber,
      bank: beneficiaryInstitution,
      name: beneficiary,
      logo
    });
  }

  // ----------------------------
  // 9. RESPONSE
  // ----------------------------
  return res.status(StatusCodes.CREATED).json({
    details,
    msg: 'notification generated, new balance updated'
  });
};

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