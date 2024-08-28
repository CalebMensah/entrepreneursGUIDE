const menuToggle = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', ()=> {
    navLinks.classList.toggle('active')
})


// redirecting the user to homepage after signup
document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const action = signupForm.getAttribute("action");
        const method = signupForm.getAttribute("method");
        fetch(action, {
            method: method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then (response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert("There was a problem with the sign up")
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was a problem with the sign up")
        });
    })
})

// asking users to subscribe when they click on the subscribe button
document.addEventListener('DOMContentLoaded', function () {
    const subscribeButton = document.getElementById('subscribe-button');

    subscribeButton.addEventListener('click', function (){
        OneSignal.push(function() {
            OneSignal.isPushNotificationsSupported().then(function(supported) {
                if (supported) {
                    OneSignal.showNativePrompt();
                }else {
                    alert("Your browser does not support push notifications");
                }
            })
        })
    })
})