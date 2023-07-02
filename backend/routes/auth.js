const express = require('express')
const router = express.Router();

const asyncHandler = require('../util/asyncHandler')

const { auth } = require("../middleware/auth")


const {sendOTP, signUp, login, changePassword} = require('../controller/auth')
const {
  resetPasswordToken,
  resetPassword,
} = require("../controller/resetPassword")


router.post('/sendOTP', asyncHandler(sendOTP))
router.post('/signup', asyncHandler(signUp))
router.post('/login', asyncHandler(login))

router.post("/changepassword", auth, asyncHandler(changePassword))


router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)



module.exports = router;