self.addEventListener("push", (event) => {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icon.jpg", // иконка уведомления
            data: { url: data.url } // можно передать ссылку
        })
    );
});

// обработка клика по уведомлению
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
