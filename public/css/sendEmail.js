require('dotenv'.config)
const { default: axios } = require("axios")
const { google } = require("googleapis")
const nodemailer = require("nodemailer")

const CLIENT_ID = process.env.OAUTH_CLIENT_ID
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET
const REDIRECT_URL = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN
const SPREADSHEET_ID = process.env.SPREADSHEET_ID

const LATEST_POST_URL = "https://businesmasters.netlify.app/latest.json";
async function fetchLatestPost() {
    try {
        const res = await axios.get(LATEST_POST_URL);
        return response.data[0]
    } catch (error) {
        console.error("Error fetching latest post:", error)
        return null
    }
}

async function sendEmails() {
    const latestPost = await fetchLatestPost();
    if(!latestPost) {
        console.error("No post found!")
        return
    }

    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
    auth.setCredentials({ refresh_token: REFRESH_TOKEN});

    const sheets = google.sheets({ version: "v4", auth});
    const response = sheets.spreadsheets.values.get({
        spreedsheetId: SPREADSHEET_ID,
        range: "Emails!A:A"
    })

    const rows = response.data.values;
    if(!rows || rows.length <= 1) return console.log("No subscribers found.")

        const subscribers = rows.slice(1).map(row => ({email: row[1]}))

        // email setup

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN
            }
        })

       for (let subscriber of subscribers) {
        const mailOptions = {
            from: `"Your Blog" <${process.env.EMAIL}>`,
            to: subscriber.email,
            subject: `New Blog Post: ${latestPost.title}`,
            text: `Hi ,\n\nCheck out our latest post: ${latestPost.title}.\n\n${latestPost.description}\n\nRead here: ${latestPost.url}`,
            html: `
            <h2>${latestPost.text}</h2>
            <p>${latestPost.description}</p>
            <img src="${latestPost.image}" alt="${latestPost.title}" style="width:100%;max-width:600px;">
               <p><a href="${latestPost.url}" style="display:inline-block;padding:10px 15px;background:#007BFF;color:#fff;text-decoration:none;border-radius:5px;">Read More </a></p>
            `
        }
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully`)
       }

}

sendEmails()