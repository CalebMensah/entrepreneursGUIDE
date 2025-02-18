const fs = require("fs")
const path = require("path")
const webpush = require("web-push")
//const fetch = (await import("node-fetch")).default
const axios = require("axios")

const publicVapidKey = "BKyqUk5qZG9yT8LOoktxaZr_-eW_5sMsLbtORzFeIaa6DiDemFNmIL4hMKGQ72QaRcAPQJWaIrvXL_gkIQVyAPU"
const privateVapidKey = "F5JhW_qZA2fyd79sklA0KHOzJZRcgsCEuSKPwWnWlv0"

webpush.setVapidDetails(
    "mailto:mensahkhalib25@gmail.com",
    publicVapidKey,
    privateVapidKey
)

exports.handler = async () => {
    try {
        const filePath = path.resolve(__dirname, "subscriptions.json");
        if(!fs.existsSync(filePath)) {
            return { statusCode: 404, bod: "No subscriptions found"}
        }

        const subscriptions = JSON.parse(fs.readFileSync(filePath));
        const response = await axios.get("https://businesmasters.netlify.app/index.json") // add Website URL
        const posts = await response.data;
        const latestPost = posts[0];

        if(!latestPost) {
            return { statusCode: 404, bod: "No posts found"}
        }

        const payload = JSON.stringify({
            title: "New Blog Post!",
            body: "Click to read the latest post!",
            icon: latestPost.image,
            url: latestPost.url
        })

        const sendPromises = subscriptions.map(sub => webpush.sendNotification(sub, payload));

        await Promise.all(sendPromises)

        return { statusCode: 200, bod: "Notifications sent successfully."}
    } catch (error) {
        console.error("Error sending notifications:", error)
        return { statusCode: 500, bod: "Failed to send notifications"}
    }
}