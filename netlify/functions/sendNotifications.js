const fetch = require('node-fetch')

exports.handler = async function (event, context) {
    // fetch the latest post from url from hugo's generated list.json file
    const baseUrl = process.env.URL;
    const latestPostUrl = `${baseUrl}/list.json`;

    try {
        // fetch the json containing the latest post url
        const response = await fetch(latestPostUrl);
        const data = await response.json();

        // extract the latest post url
        const latestUrl = data['posts-url'][0];

        // send a notification using oneSignal api
        const oneSignalApiKey = process.env.ONE_SIGNAL_API_KEY;
        const oneSignalAppId = process.env.ONE_SIGNAL_APP_ID;

        const notificationData = {
            app_id: oneSignalAppId,
            contents: {
                en: "A new post is available!"
            },
            include_player_ids: ["All"],
            url: latestUrl
        };
        const notificationResponse =await fetch ('https://oneSignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${oneSignalApiKey}`
            },
            body: JSON.stringify(notificationData)
        })
        if (!notificationResponse.ok) {
            throw new Error ('Failed to send notification')
        }

        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Notification sent successfully'})
        }
        
    } catch(error){
        console.error('Error sending notification')
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Failed to send notification'})
        }
    }
}