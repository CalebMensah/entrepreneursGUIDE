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
    OneSignal.push(function() {
        OneSignal.showSlidedownPrompt()
    })
})


// modal pop up
const modal = document.getElementById('modal');
const span = document.getElementsByClassName('close')

// show modal after 5 secs
setTimeout(function(){
    modal.style.display = 'block';
}, 5000);

// close modal when clicked the close
span.onclick = function() {
    modal.style.display = 'none';
}

// close modal when clicking outside the box
window.onclick = function (event) {
    if(event.target == modal) {
        modal.style.display = 'none';
    }
}

// ensure modal doesn't appear repeatedly
if(!localStorage.getItem('hasSeenModal')) {
    setTimeout(function() {
        modal.style.display = 'block';
        localStorage.setItem('hasSeenModal', true)
    }, 5000)
}

// exit intent trigger
document.addEventListener('mousemove', function(event) {
    if(event.clientY <=0 ) {
        modal.style.display = "block"
    }
})