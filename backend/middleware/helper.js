const jwt = require("jsonwebtoken")
const ErrorHandler = require('../util/errorHandler')

const generateToken = (payload, next) =>{
    if(!payload){
        return next(new ErrorHandler("Something went wrong while generating token", 400));
    }
    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn: '24h',
    })
}


const setCookie = (res, token, next) => {
    if(!token){
        return next(new ErrorHandler("Something went wrong while sending cookie", 400));
    }
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
		httpOnly: true,
    }
    res.cookie("token", token, options);
    next();
    
}

module.exports = {generateToken, setCookie}