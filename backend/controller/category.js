const Category = require('../model/Category')
const ErrorHandler = require('../util/errorHandler')

exports.createCategory = async(req, res, next) => {
    const {name, description} = req.body;
    if(!name){
        return next(new ErrorHandler("Field is required", 400));
    }
    const CategorysDetails = await Category.create({
        name: name,
        description: description,
    });
    return res.status(200).json({
        success: true,
        message: "Category Created Successfully"
    })
}

exports.showAllCategories = async(req, res, next) => {
    const allCategory = await Category.find({},
        {name: true, description: true}
        );
    return res.status(200).json({
        success: true,
        data: allCategory
    })
}


exports.categoryPageDetails = async(req, res, next) => {
    const {categoryId} = req.body;
    const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
    if(!selectedCategory) {
        return next(new ErrorHandler("data not found", 404));
    }
    const differentCategories = await Category.find({
                                             _id: {$ne: categoryId},})
                                             .populate("courses")
                                             .exec()
    return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                },
     });

}