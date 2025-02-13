const menuToggle = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');
const spinner = document.getElementById('loading-spinner');

menuToggle.addEventListener('click', ()=> {
    navLinks.classList.toggle('active')
})



document.addEventListener("DOMContentLoaded", () => {
    setTimeout (() => {
        showNotificationModal();
    }, 5000)
})

function showNotificationModal() {
    const modal = document.createElement("div");
    modal.innerHTML = `
    <div id='notification-modal' class="model-overlay">
    <div class="model-content">
    <h2>Enable Notifications</h2>
    <p>Get updates on new blog posts!</p>
    <div class="model-buttons">
     <button id="allow-notifications">Allow</button>
    <button id="deny-notifications">Deny</button>
    </div>
    </div>
    </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('allow-notifications').addEventListener("click", requestNotificationPermission);
    document.getElementById("deny-notifications").addEventListener("click", () => modal.remove())
}

async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        registerServiceWorker();
    } 
    document.getElementById("notification-modal").remove()
}

async function registerServiceWorker() {
    if("serviceWorker" in navigator && "PushManager" in window ) {
        try {
            const registration = await navLinks.serviceWorker.register("/sw.js");
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BKyqUk5qZG9yT8LOoktxaZr_-eW_5sMsLbtORzFeIaa6DiDemFNmIL4hMKGQ72QaRcAPQJWaIrvXL_gkIQVyAPU"
            });

            await fetch("/.netlify/functions/saveSubscription", {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {"Content-Type": "application/json"}
            })
            console.log("User subscribed to push notifications")
        } catch (error) {
           console.error("Service worker registration failed:", error)
        }
    }
}



