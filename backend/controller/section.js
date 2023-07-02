const Course = require("../model/Course");
const Section = require("../model/Section");
const SubSection = require('../model/SubSection');
const ErrorHandler = require("../util/errorHandler");


exports.createSection = async(req, res, next) => {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
        return next(new ErrorHandler("Missing required properties", 400));
    }
    const newSection = await Section.create({ sectionName });
    const updatedCourse = await Course.findByIdAndUpdate(courseId,{
                                        $push: {
                                        courseContent: newSection._id,
                                     },
                                },{ new: true }
                            ).populate({
                                path: "courseContent",
                                populate: {
                                    path: "subSection",
                                },
                            })
                            .exec();
    res.status(200).json({
        success: true,
        message: "Section created successfully",
        updatedCourse,
    });
}


exports.updateSection = async (req, res, next) => {
    const { sectionName, sectionId, courseId} = req.body;
    
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);
        if(!section){
            return next(new ErrorHandler("Section Not Found", 400))
        }

        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path:"subSection"
            }
        }).exec()
       
        res.status(200).json({
		success: true,
		message: "Section updated successflly",
        data: course
	})
}

exports.deleteSection = async (req, res, next) => {

		
    const { sectionId, courseId }  = req.body;
    await Course.findByIdAndUpdate(courseId, {
        $pull: {
            courseContent: sectionId,
        }
    })
    const section = await Section.findById(sectionId);
    if(!section) {
        return next(new ErrorHandler("Section not Found", 404))
    }

    //delete sub section
    await SubSection.deleteMany({_id: {$in: section.subSection}});

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return 
    const course = await Course.findById(courseId).populate({
        path:"courseContent",
        populate: {
            path: "subSection"
        }
    })
    .exec();

    res.status(200).json({
        success:true,
        message:"Section deleted",
        data:course
    });
	
};