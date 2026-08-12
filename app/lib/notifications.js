"use client";

// Best-effort real OS-level push notification. Browsers require a permission grant and a
// secure context, and some environments (embedded webviews, non-HTTPS) don't support the
// Notification API at all — so this is always paired with the in-app toast in
// TrainingFlow.js, which works unconditionally and is the notification the user is
// guaranteed to see. Permission is only requested lazily, on the first day completion,
// never proactively on page load.
export function firePushNotification(title, body) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  try {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") new Notification(title, { body });
      });
    }
  } catch {
    // Notification constructor can throw in some embedded/sandboxed contexts — the in-app
    // toast already covers the user-visible confirmation, so this is safe to swallow.
  }
}
