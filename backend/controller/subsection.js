const Section = require('../model/Section')
const SubSection = require('../model/SubSection');
const { uploadImageToCloudinary } = require("../util/imageUploader");
const ErrorHandler = require('../util/errorHandler')

exports.createSubSection = async(req, res, next) => {
    const { sectionId, title, description } = req.body
      const video = req.files.video
      if (!sectionId || !title || !description || !video) {
        return next(new ErrorHandler("All fields are required", 400));
      }
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      const SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
      })

      const updatedSection = await Section.findByIdAndUpdate(
        { _id: sectionId },
        { $push: { subSection: SubSectionDetails._id } },
        { new: true }
      ).populate("subSection")

      return res.status(200).json({ 
        success: true,
        data: updatedSection })
}


exports.updateSubSection = async(req, res, next) => {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)
    if (!subSection) {
        return next(new ErrorHandler("Subsection not found", 400));
      }
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
      await subSection.save()
      const updatedSection = await Section.findById(sectionId).populate("subSection")

      return res.json({
        success: true,
        message: "Section updated successfully",
      })

}


exports.deleteSubSection = async(req, res, next) => {
  const {subSectionId, sectionId} = req.body
  
  await Section.findByIdAndUpdate(
    { _id: sectionId },
    {
      $pull: {
        subSection: subSectionId,
      },
    }
  )
  const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  if(!subSection){
    return next(new ErrorHandler("Subsection Not Found"))
  }

  const updatedSection = await Section.findById(sectionId).populate("subSection")

  return res.json({
    success: true,
    message: "SubSection deleted successfully",
    data: updatedSection
  })

}

