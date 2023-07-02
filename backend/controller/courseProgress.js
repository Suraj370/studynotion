const CourseProgress = require( '../model/CourseProgress');
const ErrorHandler = require('../util/errorHandler');
const User = require('../model/User')
const SubSection = require('../model/SubSection');

exports.updateCourseProgress = async(req, res, next) => {
    const {courseId, subsectionId} = req.body;
    const userId  = req.user.id;
    const subSection = await SubSection.findById(subsectionId);
    if(!subSection){
        return next(new ErrorHandler("Invalid subSection", 404))
    }
    let courseProgress = await CourseProgress.findOne({
        courseId: courseId,
        user: userId,
    })
    if(!courseProgress){
        return next(new ErrorHandler("Course Progress does not exist", 404))
    }
    else{
        if(courseProgress.completedVideos.includes(subsectionId)){
            return next(new ErrorHandler("subSection already completed", 401));
        }
        courseProgress.completedVideos.push(subsectionId);

    }
    await courseProgress.save();
    return res.status(200).json({
        success: true,
        message: "Course Progress Update successfully"
    })
}