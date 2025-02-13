import fs from "fs";
const path = require("path")

exports.handler = async (event) => {
    if(event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method not allowed "}
    }

    try {
        const subscription = JSON.parse(event.body);
        const filePath = path.resolve(__dirname, "subscriptions.json");
        let subscriptions = []

        if(fs.existsSync(filePath)) {
            subscriptions = JSON.parse(fs.readFileSync(filePath));
        }

        if(!subscriptions.find(sub => JSON.stringify(subscription))) {
            subscriptions.push(subscription);
            fs.writeFileSync(filePath, JSON.stringify(subscriptions))
        }

        return { statusCode: 201, body: "Subscription saved"}
    } catch(error) {
        console.error("Error saving subscription", error)
        return { statusCode: 500, body: "Failed to save subscription"}
    }
}