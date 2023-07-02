const mongoose = require("mongoose")
const mailSender = require("../util/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
    },
  otp: {
    type: String,
    required: true,

  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, 
  },

});
async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
	    await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
otpSchema.post("save", async function () {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew || this.isModified) {
		await sendVerificationEmail(this.email, this.otp);
	}
	
});
const OTP = mongoose.model('otp', otpSchema);

module.exports = OTP;