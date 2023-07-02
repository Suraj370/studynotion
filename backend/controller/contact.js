const mailSender = require("../util/mailSender");
const {contactUsEmail} = require('../mail/templates/contactFormRes');
const ErrorHandler = require("../util/errorHandler");
exports.contact = async(req, res, next) => {
   try{
      const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
   const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )


     res.status(200).json({
        success: true,
        message: "Data Sent succesfully"
     })
   }
   catch(error){
      return next(new ErrorHandler(error, error.status))
   }
   
}