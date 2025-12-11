const express = require('express')
const upload = require('../middleware/Upload')
const router = express.Router()
const {login , signUp , compereLoginCode , updateLoginCode} = require('../controllers/auth')
router.post('/login' ,login)
router.post('/signUp' ,  upload.single('profileImage'),  signUp)
router.post('/compereLoginCode' ,   compereLoginCode)
router.post('/updateLoginCode' ,   updateLoginCode)

module.exports = router