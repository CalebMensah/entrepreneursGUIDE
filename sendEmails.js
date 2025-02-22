require('dotenv').config();
const axios = require("axios");
const nodemailer = require("nodemailer");

const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_API_KEY;

const SHEETDB_URL = "https://sheetdb.io/api/v1/w7eydswfjd972";

const LATEST_POST_URL = "https://businessmasters.netlify.app/index.json";

async function fetchLatestPost() {
    try {
        const response = await axios.get(LATEST_POST_URL);
        return response.data[0];
    } catch (error) {
        console.error("Error fetching latest post:", error);
        return null;
    }
}

async function fetchSubscribers() {
    try {
        const response = await axios.get(SHEETDB_URL);

        if (!response.data || response.data.length === 0) {
            console.log("No subscribers found.");
            return [];
        }

        const subscribers = response.data.map(row => row.Email);
        console.log('subscribers:', subscribers)
        return subscribers;
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return [];
    }
}

async function sendEmails() {
    const latestPost = await fetchLatestPost();
    if (!latestPost) {
        console.error("No latest post found.");
        return;
    }

    const subscribers = await fetchSubscribers();
    if (subscribers.length === 0) {
        console.log("No subscribers to send emails to.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: APP_PASSWORD
        }
    });

    for (let email of subscribers) {
        const mailOptions = {
            from: `"Your Blog" <${EMAIL}>`,
            to: email,
            subject: `New Blog Post: ${latestPost.title}`,
            text: `Hi,\n\nCheck out our latest post: ${latestPost.title}.\n\n${latestPost.summary}\n\nRead here: ${latestPost.url}`,
            html: `
                <h2>${latestPost.title}</h2>
                <p>${latestPost.summary}</p>
                <img src="${latestPost.image_url}" alt="${latestPost.title}" style="width:100%;max-width:600px;" />

                <p><a href="${latestPost.url}" style="display:inline-block;padding:10px 15px;background:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">Read More</a></p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${email}`);
        } catch (error) {
            console.error(`Error sending email to ${email}:`, error);
        }
    }
}

sendEmails();
