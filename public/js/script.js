const menuToggle = document.querySelector('.toggle-menu');
const navLinks = document.querySelector('.nav-links');
const spinner = document.getElementById('loading-spinner');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.addEventListener("DOMContentLoaded", () => {
    // Check if notifications are already allowed
    OneSignal.push(function() {
        OneSignal.isPushNotificationsEnabled().then(function(isEnabled) {
            if (!isEnabled) {
                // Show modal after 5 seconds only if notifications are not enabled
                setTimeout(() => {
                    showNotificationModal();
                }, 5000);
            }
        });
    });
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

    document.getElementById('allow-notifications').addEventListener("click", function() {
        OneSignal.push(function() {
            OneSignal.registerForPushNotifications();
        });
        modal.remove();
    });

    document.getElementById("deny-notifications").addEventListener("click", () => modal.remove());
}

// Initialize OneSignal
window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
    OneSignal.init({
        appId: "3684ab0f-136e-404a-ab10-8206040c0129",  // Replace with your OneSignal App ID
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
        notifyButton: { enable: false }  // Hide default notify button since we use a modal
    });
});
