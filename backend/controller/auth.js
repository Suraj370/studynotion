const totp = require('otplib').totp
const ErrorHandler = require('../util/errorHandler')
const OTP = require('../model/OTP')
const User = require('../model/User')
const Profile = require('../model/Profile')
const bcrypt = require('bcrypt')
const mailSender = require("../util/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const {generateToken, setCookie} = require('../middleware/helper')

exports.sendOTP = async(req, res, next) => {
    const {email} = req.body;
    if(!email){
        return next(new ErrorHandler("All fields are required", 400));
    }
    const isUserExist = await User.findOne({email});
    if(isUserExist){
        return next(new ErrorHandler("User already regstered", 400));
    }
    const secret = process.env.OTP_SECRET
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    var token = totp.generate(secret, expiresAt);
    await OTP.create({
        email,
        otp: token,
    })
    return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        token
    })

}


exports.signUp = async(req, res, next) =>{
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
        
    } = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return next(new ErrorHandler('Please fill all the details', 400))
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password and Confirm Password do not match. Please try again.", 400));
    }
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return next(new ErrorHandler("User already exists. Please sign in to continue.", 400));
    }
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if(response.length == 0){
        return next(new ErrorHandler("Invalid otp", 400));
    }
    else if(otp !== response[0].otp){

        return next(new ErrorHandler("Invalid otp", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null, 
        contactNumber: contactNumber
    });
    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType: accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
    });
}



exports.login = async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please fill the required details", 400));
    }
    var user = await User.findOne({email}).populate("additionalDetails");
    if(!user){
        return next(new ErrorHandler("User is not Registered with Us Please SignUp to Continue", 401));
    }
    if(await bcrypt.compare(password, user.password)){
        const payload = {email: user.email, id: user._id, accountType: user.accountType}
        const token = generateToken(payload);
        user = user.toObject();
        user.token = token;
        user.password = undefined;
        setCookie(res, token, next);
        return res.status(200).json({
            success: true,
            token,
            user,
            message: `User Login Success`,
        });
    }
    else{
        return next(new ErrorHandler("email or password is incorrect", 401));
    }
}


exports.changePassword = async(req, res, next) => {
    const userDetails = await User.findById(req.user.id);
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword ){
        return next(new ErrorHandler("All fields are required", 400));
    }

    const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
    );
    if (!isPasswordMatch) {
            return next(new ErrorHandler("The password is incorrect", 401));
    }
   
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
    );
    try {
         await mailSender(
            updatedUserDetails.email,
            "Password changed Successfully",
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        );
    } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error);
        return next(new ErrorHandler("Error occured while sending email", 500));
    }
    return res.status(200).json({
        success: true,
        message: "Password updated successfully"
    })
}