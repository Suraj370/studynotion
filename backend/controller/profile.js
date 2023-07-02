const ErrorHandler = require('../util/errorHandler')
const User = require('../model/User')
const Profile = require('../model/Profile')
const Course = require("../model/Course")

const bcrypt = require('bcrypt');
const { uploadImageToCloudinary } = require("../util/imageUploader");
const { convertSecondsToDuration } = require("../util/secToDuration")
const CourseProgress = require( '../model/CourseProgress');



exports.updateProfile = async(req, res, next) => {
    const { dateOfBirth = "", about = "", gender,contactNumber } = req.body;
    const id = req.user.id;
    const userDetails = await User.findById(id);

    
	
    const profile = await Profile.findById(userDetails.additionalDetails);
    profile.gender = gender;
    profile.dateOfBirth = dateOfBirth;
	profile.about = about;
	profile.contactNumber = contactNumber;

    await profile.save();
    const updateduserDetails = await User.findById(id)
    .populate("additionalDetails")
    .exec();
    return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data:updateduserDetails,
    })
}

exports.deleteAccount = async(req, res, next) => {
    const id = req.user.id;
    const user = await User.findById({ _id: id });
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });
    await User.findByIdAndDelete({ _id: id });
	res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
}


exports.getUserDetails = async(req, res, next) => {
    const id = req.user.id;
    const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
    res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
}

exports.updateDisplayPicture = async(req, res, next) => {

    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    console.log(userId);
    const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })


}

exports.getEnrolledCourses = async(req, res, next) => {
    const userId = req.user.id
      var userDetails = await User.findOne({
        _id: userId,
      }).populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          }
        }
      })
      .exec()
      if(!userDetails){
        return next(new ErrorHandler(`Could not find user with id: ${userId}`))
      }
      userDetails = userDetails.toObject()
      var subSectionLength = 0;
      for(var i = 0; i< userDetails.courses.length; i++){
        let totalDurationinSeconds = 0;
        subSectionLength = 0;
        for(var j = 0; j <userDetails.courses[i].courseContent.length; j++){
          totalDurationinSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationinSeconds)
          subSectionLength +=userDetails.courses[i].courseContent[j].subSection.length; 
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseId: userDetails.courses[i]._id,
          user: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length;
        if(subSectionLength == 0){
          userDetails.courses[i].progressPercentage = 100
        }else{
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / subSectionLength) * 100 * multiplier)/ multiplier
        }
      }
   
      
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      });
}

exports.instructorDashboard = async(req, res, next) => {
  const courseDetails = await Course.find({instructor: req.user.id});

  const courseData = courseDetails.map((course) => {
  const totalStudentsEnrolled = course.studentsEnrolled.length
  const totalAmountGenerated = totalStudentsEnrolled * course.price;
    
    
  const courseDataWithStats = {
      _id: course._id,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      totalStudentsEnrolled,
      totalAmountGenerated,
    }
    return courseDataWithStats
  })

  res.status(200).json({
    success: true,
    course: courseData,
  })
  
 
}


