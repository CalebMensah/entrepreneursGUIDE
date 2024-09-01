const fetch = require('node-fetch')

exports.handler = async function (event, context) {
   try {
    // fetch the latest post
    const response = await fetch (`${process.env.URL}/list.json`);
    const data = await response.json();

    if (data.length > 0) {
      const latestPost = data[0]

      // send a notification via onesignal
      const notificationResponse = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${process.env.ONE_SIGNAL_API_KEY}`
        },
        body: JSON.stringify({
            app_id: process.env.ONE_SIGNAL_APP_ID,
            included_segments:['All'],
            headings: {"en": `"New Post": ${latestPost.title}` },
            contents: {"en": latestPost.summary},
            url: latestPost.url
        })
      })
      const notificationData = await notificationResponse.json();
      console.log('Notification sent:', notificationData)
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Notifications sent successfully'})
    };
   } catch(error) {
    console.error('Error sending notification:', error)
    return {
        statusCode: 500,
        body: JSON.stringify({error: 'Failed to send notification'})
    }
   }
}