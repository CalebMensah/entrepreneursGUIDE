const menuToggle = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');
const spinner = document.getElementById('loading-spinner');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Initialize OneSignal
window.OneSignal = window.OneSignal || [];
OneSignal.push(async function() {
    try {
        await OneSignal.init({
            appId: "3684ab0f-136e-404a-ab10-8206040c0129",  // Replace with your OneSignal App ID
            notifyButton: { enable: false }  // Hide default notify button since we use a modal
        });

        console.log("One signal initialized successfully")

        // check if user already exist
        const isSubscribed = await OneSignal.isPushNotificationsEnabled();
        console.log("Notification enabled:", isSubscribed);

        if(!isSubscribed) {
            setTimeout(() => {
                showNotificationModal()
            }, 5000)
        }
    } catch (error) {
        console.error("OneSignal Initialization error:", error)
    }
});

function showNotificationModal() {
    const modal = document.createElement("div");
    modal.innerHTML = `
        <div id='notification-modal' class="modal-overlay">
            <div class="modal-content">
                <h2>Enable Notifications</h2>
                <p>Get updates on new blog posts!</p>
                <div class="modal-buttons">
                    <button id="allow-notifications">Allow</button>
                    <button id="deny-notifications">Deny</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('allow-notifications').addEventListener("click", async function() {
        try {
            await OneSignal.registerForPushNotifications();
            console.log("User subscribed to notifications")
        } catch (error) {
            console.error("Subscription error:", error)
        }
        modal.remove()
    });

    document.getElementById("deny-notifications").addEventListener("click", () => {
        console.log("User denied notifications")
        modal.remove()
    });
}


