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
document.getElementById('subscribe-button').addEventListener('click', function() {
    OneSignal.push(function(){
        OneSignal.isPushNotificationsEnabled(function(isEnabled) {
            if (!isEnabled) {
                OneSignal.registerForPushNotifications();
            }else {
                alert('You are already subscribed for daily updates')
            }
        })
    })
})