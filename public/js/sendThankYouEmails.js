import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: APP_PASSWORD
        }
    });

export async function sendThankYouEmail(email) {
    const mailOptions = {
        from: 'YOUR_EMAIL_ADDRESS',
        to: email,
        subject: 'Thank You for Downloading Our Ebook!',
        text: 'Hi,\n\nThank you for downloading our ebook. We hope you enjoy reading it!\n\nBest regards,\nYour Company',
        html: '<p>Hi,</p><p>Thank you for downloading our ebook. We hope you enjoy reading it!</p><p>Best regards,<br>Your Company</p>'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Thank-you email sent successfully.');
    } catch (error) {
        console.error('Error sending thank-you email:', error);
    }
}


