



// trigger the popup when the ebook link is clicked
document.getElementById('download-ebook-trigger').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('ebook-popup').style.display = 'block';
});

// close the modal when the close button is clicked
document.querySelector('.close-popup').addEventListener('click', function () {
    document.getElementById('ebook-popup').style.display = 'none'
})
// close the modal when they click on an empty space
window.addEventListener('click', function(event) {
  if(event.target === document.getElementById('ebook-popup')) {
    this.document.getElementById('ebook-popup').style.display = 'none'
  }
})

// handle form submission
document.getElementById('ebook-download-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // show thank you message
    document.getElementById('thank-you-message').style.display = "block";

    // stimulate the download process
    setTimeout(function () {
        const pdfUrl = '/files/ebook.pdf';
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'ebook.pdf';
        link.click()

        // close the popup after download
        document.getElementById('ebook-popup').style.display = 'none';
    }, 2000)
})