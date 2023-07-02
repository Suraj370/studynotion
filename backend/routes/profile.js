const express = require('express')
const router = express.Router();

const asyncHandler = require('../util/asyncHandler')


const { auth } = require("../middleware/auth")

const { updateProfile, updateDisplayPicture,
    getUserDetails, getEnrolledCourses, deleteAccount,instructorDashboard} = require('../controller/profile')


router.get("/getUserDetails", auth, asyncHandler(getUserDetails))

router.put("/updateProfile", auth, asyncHandler(updateProfile))
router.put("/updateProfilePic", auth, asyncHandler(updateDisplayPicture))
router.delete("/deleteProfile", auth, asyncHandler(deleteAccount))
router.get('/enrolledCourses',auth, asyncHandler(getEnrolledCourses))
router.get('/instructorDashboard', auth, asyncHandler(instructorDashboard))

module.exports = router;