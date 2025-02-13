self.addEventListener("push", event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: data.icon,
        data: {url: data.url}
    };

    event.waitUntil(self.ServiceWorkerRegistration.showNotification(data.title, options));
})

self.addEventListener("notificationclick", event => {
    event.notification.close();
    if(event.notification.data.url) {
        clients.openWindow(event.notification.data.url)
    }
})