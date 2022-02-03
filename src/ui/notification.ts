export function notify(text: string, timeoutMs: number = 5000) {
  const notificationEl = document.createElement("div");
  notificationEl.classList.add("notification");
  notificationEl.innerHTML = text;
  document.body.appendChild(notificationEl);

  setTimeout(() => {
    document.body.removeChild(notificationEl);
  }, timeoutMs);
}
