const express = require("express")
const router = express.Router()

const {auth, isStudent} = require('../middleware/auth')
const asyncHandler = require('../util/asyncHandler')
const {capturePayment, verifyPayment, sendPaymentSuccessEmail,  } = require("../controller/payment")


router.post("/capturePayment", auth, isStudent, asyncHandler(capturePayment))
router.post("/verifyPayment",auth, isStudent, asyncHandler(verifyPayment))
router.post("/sendPaymentSuccessEmail", auth, isStudent, asyncHandler(sendPaymentSuccessEmail))


module.exports = router