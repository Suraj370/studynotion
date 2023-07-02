const express = require("express")
const router = express.Router()

const asyncHandler = require('../util/asyncHandler')
const {contact} = require('../controller/contact')

router.post('/contact', asyncHandler(contact))

module.exports = router