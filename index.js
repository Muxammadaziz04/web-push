const VAPID_PUBLIC_KEY = "BH6_ukzAnkPI_WzV-2r6QxYFKuk9FR2VhJeRzEQcjZnJEQzYisjASFCPzfG6DFfx82v480fpKuHdcXNDHHf-VLU";

async function subscribeUser() {
    // регистрируем service worker
    const reg = await navigator.serviceWorker.register("/sw.js");

    // спрашиваем разрешение у пользователя
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        alert("Вы отклонили разрешение на уведомления");
        return;
    }

    // подписываем пользователя
    const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // отправляем подписку на сервер
    await fetch("http://localhost:4000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription)
    });

    alert("Подписка оформлена!");
}

// helper для конвертации ключа
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
