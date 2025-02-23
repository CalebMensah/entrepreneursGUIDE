const nodemailer =require("nodemailer")
require("dotenv").config()

dotenv.config();


const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;



exports.handler = async (event) => {

    try {
        const {email} = JSON.parse(event.body)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: APP_PASSWORD
            }
        });

        const mailOptions = {
            from: 'YOUR_EMAIL_ADDRESS',
            to: email,
            subject: 'Thank You for Downloading Our Ebook!',
            text: 'Hi,\n\nThank you for downloading our ebook. We hope you enjoy reading it!\n\nBest regards,\nYour Company',
            html: '<p>Hi,</p><p>Thank you for downloading our ebook. We hope you enjoy reading it!</p><p>Best regards,<br>Your Company</p>'
        };

        await transporter.sendMail(mailOptions);
        console.log('Thank-you email sent successfully.');
    } catch (error) {
        console.error('Error sending thank-you email:', error);
    }
}


