const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })

            const mailOptions = {
              from: '"StudyNotion " <no-reply@gmail.com>', // sender address   
              to: `${email}`,
               subject: `${title}`,
               html: `${body}`,
            }

    

            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Email sent successfully");
                }
            });
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;