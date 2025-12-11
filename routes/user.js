const express = require("express");
const router = express.Router();
const authenthicationMiddleware = require('../middleware/Authenthication')
const upload = require('../middleware/Upload')
const {  getCurrentUserDetails, updateUser } = require('../controllers/User');

router.get("/me", authenthicationMiddleware, getCurrentUserDetails);
router.patch("/update", authenthicationMiddleware,  upload.single('image'), updateUser);


module.exports = router;
