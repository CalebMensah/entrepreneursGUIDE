document.addEventListener('DOMContentLoaded', function() {
  var downloadTrigger = document.getElementById('download-ebook-trigger');
  if (downloadTrigger) {
      downloadTrigger.addEventListener('click', function(event) {
          event.preventDefault();
          document.getElementById('ebook-popup').style.display = 'block';
      });
  }

  var closePopup = document.querySelector('.close-popup');
  if (closePopup) {
      closePopup.addEventListener('click', function () {
          document.getElementById('ebook-popup').style.display = 'none';
      });
  }

  window.addEventListener('click', function(event) {
      if (event.target === document.getElementById('ebook-popup')) {
          document.getElementById('ebook-popup').style.display = 'none';
      }
  });

  document.getElementById('ebook-download-form').addEventListener('submit', function(event) {
      event.preventDefault();

      document.getElementById('thank-you-message').style.display = "block";

      setTimeout(function () {
          const pdfUrl = '/files/ebook.pdf';
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = 'ebook.pdf';
          link.click();

          document.getElementById('ebook-popup').style.display = 'none';
      }, 2000);
  });
});
