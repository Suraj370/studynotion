const express = require("express")
const router = express.Router()

const asyncHandler = require('../util/asyncHandler')
const { auth, isAdmin, isInstructor, isStudent} = require("../middleware/auth")


const {createCategory, showAllCategories, categoryPageDetails} = require('../controller/category')
const {createCourse, 
    getAllCourses, 
    getCourseDetails, 
    getInstructorCourses, 
    editCourse, 
    deleteCourse,
    getFullCourseDetails,
} = require('../controller/course')


const {createSection, updateSection, deleteSection} = require('../controller/section')
const {createSubSection, updateSubSection, deleteSubSection}= require('../controller/subsection')

const {createRating, getAverageRating, getAllRating} = require('../controller/ratingandreview')
const {updateCourseProgress} = require('../controller/courseProgress')



router.post("/createCategory", auth, isAdmin, asyncHandler(createCategory))
router.get("/showAllCategories", asyncHandler(showAllCategories))
router.post("/getCategoryPageDetails", asyncHandler(categoryPageDetails))

router.post("/createCourse", auth, isInstructor, asyncHandler(createCourse))
router.get("/getAllCourses", asyncHandler(getAllCourses))
router.post("/getCourseDetails", asyncHandler(getCourseDetails))
router.post("/getFullCourseDetails", auth, asyncHandler(getFullCourseDetails))

router.post('/editCourse',asyncHandler(editCourse))
router.get("/getInstructorCourses",auth, isInstructor, asyncHandler(getInstructorCourses))
router.delete('/deleteCourse', auth, isInstructor, asyncHandler(deleteCourse))

router.post("/addSection", auth, isInstructor, asyncHandler(createSection))
router.post("/updateSection", auth, isInstructor, asyncHandler(updateSection))
router.post("/deleteSection", auth, isInstructor, asyncHandler(deleteSection))

router.post("/addSubSection", auth, isInstructor, asyncHandler(createSubSection))
router.post("updateSubSection", auth, isInstructor, asyncHandler(updateSubSection))
router.post("/deleteSubSection", auth, isInstructor, asyncHandler(deleteSubSection))

router.post("/createRating", auth, isStudent, asyncHandler(createRating))
router.get("/getAverageRating", asyncHandler(getAverageRating))
router.get("/getReviews", asyncHandler(getAllRating))

router.post('/updateCourseProgress',auth, isStudent, asyncHandler(updateCourseProgress))

module.exports = router