const menuToggle = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');
const spinner = document.getElementById('loading-spinner');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});




