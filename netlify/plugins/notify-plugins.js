module.exports = {
    onSuccess: async ({ utils }) => {
        try {
            await fetch(`${process.env.URL}/.netlify/functions/sendNotification`);
            console.log('Notification function triggered successfully');
        } catch (error) {
            console.error('Failed to trigger the notification function')
            utils.build.failBuild('Failed to trigger the notification function', { error })
        }
    }
}