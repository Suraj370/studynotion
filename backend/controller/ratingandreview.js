const RatingAndReview = require('../model/RatingAndReview');
const Course = require('../model/Course')
const ErrorHandler = require('../util/errorHandler');

exports.createRating = async(req, res, next) => {
    const userId = req.user.id;
    const {rating, review, courseId} = req.body;
    const courseDetails = await Course.findOne({_id:courseId,
                                            studentsEnrolled: {$elemMatch: {$eq: userId} },
                                            });
    if(!courseDetails){
        return next(new ErrorHandler("Student is not enrolled in this course", 404));
    }

    const alreadyReviewed = await RatingAndReview.findOne({user: userId,
                                                        course: courseId
                                                     })
    if(alreadyReviewed){
        return next(new ErrorHandler("Course is already reviewd by user", 403))
    }
    const ratingreview = await RatingAndReview.create({rating, review,
                                                        course: courseId,
                                                        user: userId})                                                     
    const updateCourseDetails = await Course.findByIdAndUpdate({_id: courseId,},
                                                                {
                                                                    $push:{
                                                                        ratingAndReviews: ratingreview._id,
                                                                    }
                                                                }, {new: true});
    return res.status(200).json({
        success: true,
        message: "Rating and Review created successfully",
        ratingreview
    })
}


exports.getAverageRating = async(req, res, next) => {
    const courseId = req.body.courseId
    const result = await RatingAndReview.aggregate([
        {
            $match:{
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $group:{
                _id:null,
                averageRating: { $avg: "$rating"},
            }
        }
    ])
    if(result.length > 0) {

        return res.status(200).json({
            success:true,
            averageRating: result[0].averageRating,
        })

    }
    
    //if no rating/Review exist
    return res.status(200).json({
        success:true,
        message:'Average Rating is 0, no ratings given till now',
        averageRating:0,
    })
}

exports.getAllRating = async(req, res, next) => {
    const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
}