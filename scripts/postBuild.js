const { exec } = require("child_process");

exec(`curl -X POST -d '{}' ${process.env.SITE_URL}/.netlify/functions/sendNotifications`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error triggering function: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Function triggered: ${stdout}`);
});
