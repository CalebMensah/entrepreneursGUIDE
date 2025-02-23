const fs = require("fs")
const webpush = require("web-push")
const path = require("path")
const axios = require("axios")
require("dotenv").config()

const SUBSCRIPTION_FILE = path.resolve(__dirname, "subscriptions.json")
const LATEST_POST = "https://businessmasters.netlify.app/index.json"

webpush.setVapidDetails(
    "mailto:mensahkhalib25@gmail.com",
    process.env.WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
)

console.log("Running notifications.js ....")

function fetchSubscribers () {
    console.log(`Fetching all subscribers from ${SUBSCRIPTION_FILE}`)
    if(!fs.existsSync(SUBSCRIPTION_FILE)) {
        console.error("Error: subscriptions.json file not found.")
        return []
    }
    const subscribers = JSON.parse(fs.readFileSync(SUBSCRIPTION_FILE, "utf8"))
    console.log(`Found ${subscribers.length} subscribers`)
    return subscribers
}

// function to fetch latest post
async function fetchLatestPost() {
    console.log("Fetching latest post")
    try {
        const response = await axios.get(LATEST_POST);
        if(!response.data.length) throw new Error("No post found")
            console.log("Latest post fetched:", response.data[0].title);
        return response.data[0];
    } catch (error) {
        console.error("Error fetching latest post:", error.message);
        return null;
    }
}

// function to send push notifications
async function sendNotifications() {
   console.log("Preparing to send notifications")
   const latestPost = await fetchLatestPost();
   if(!latestPost) return console.log("No new post detected. Exiting...")
    const subscribers = fetchSubscribers();
    if(subscribers.length === 0) return console.log(`Sending notifications to ${subscribers.length} subscribers...`);

    const payload = JSON.stringify({
        title: "New Blog Post!",
        body: latestPost.title,
        icon: latestPost.image_url,
        url: latestPost.url
    })
    for (const subscriber of subscribers) {
        try {
            await webpush.sendNotification(subscriber, payload);
            console.log(`Notification sent to ${subscriber.endpoint}`);
        } catch (error) {
            console.error(`Error sending notification to ${subscriber.endpoint}:`, error.message);
        }
    }
    console.log("All notifications sent successfully!")
}

sendNotifications()