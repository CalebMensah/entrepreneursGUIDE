require('dotenv').config();
const nodemailer = require("nodemailer");

const EMAIL = process.env.EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: APP_PASSWORD
    }
});

async function sendThankYouEmail(email) {
    const mailOptions = {
        from: EMAIL,
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

document.getElementById('download-ebook-trigger').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('ebook-popup').style.display = 'block';
});

document.querySelector('.close-popup').addEventListener('click', function() {
  document.getElementById('ebook-popup').style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === document.getElementById('ebook-popup')) {
    document.getElementById('ebook-popup').style.display = 'none';
  }
});

document.getElementById('ebook-download-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('user-email').value.trim();
  const responseMessage = document.getElementById('thank-you-message');

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    responseMessage.innerHTML = "Enter a valid email address.";
    responseMessage.style.color = "red";
    return;
  }

  responseMessage.innerHTML = "Checking...";
  responseMessage.style.display = "block";
  responseMessage.style.color = "green";

  try {
    // Check if email already exists
    const checkResponse = await fetch(
      `https://sheetdb.io/api/v1/w7eydswfjd972/search?Email=${encodeURIComponent(email)}`
    );
    
    if (!checkResponse.ok) throw new Error("Check failed");

    const existingData = await checkResponse.json();
    console.log("API Response:", existingData);

    if (existingData.length > 0) {
      // Email already exists, proceed with download
      responseMessage.innerHTML = "Email already subscribed! Downloading...";
      responseMessage.style.color = "blue";

      // Simulate the download process
      setTimeout(async function() {
        const pdfUrl = '/files/ebook.pdf';
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'ebook.pdf';
        link.click();

        // send thank you email
        await sendThankYouEmail(email)
        // Close the popup after download
        document.getElementById('ebook-popup').style.display = 'none';
      }, 2000);
    } else {
      // Email does not exist, add to spreadsheet and proceed with download
      responseMessage.innerHTML = "Adding email and downloading...";

      const postResponse = await fetch("https://sheetdb.io/api/v1/w7eydswfjd972", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [{ 
            Email: email, 
            Joined_at: new Date().toLocaleString() 
          }]
        }),
      });

      if (postResponse.ok) {
        responseMessage.innerHTML = "Subscription successful! Downloading...";
        responseMessage.style.color = "green";

        setTimeout(async function() {
          const pdfUrl = '/files/ebook.pdf';
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = 'ebook.pdf';
          link.click();

          await sendThankYouEmail(email)

          // Close the popup after download
          document.getElementById('ebook-popup').style.display = 'none';
        }, 2000);
      } else {
        responseMessage.innerHTML = "Error. Try again.";
        responseMessage.style.color = "red";
      }
    }
  } catch (error) {
    console.error("Error:", error);
    responseMessage.innerHTML = "Failed to submit. Please try again.";
    responseMessage.style.color = "red";
  }
});