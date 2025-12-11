const express = require('express')
const router = express.Router()
const authenthicationMiddleWare = require('../middleware/Authenthication')
const {TransferFunds , getAllTransactions, getAllNotification , getAllBeneficiaries} = require('../controllers/Transfer')
router.post('/send' , authenthicationMiddleWare ,  TransferFunds)
router.get('/allTransactions' , authenthicationMiddleWare , getAllTransactions)
router.get('/allNotifications' , authenthicationMiddleWare , getAllNotification)
router.get('/allBeneficiaries' , authenthicationMiddleWare , getAllBeneficiaries)
module.exports = router