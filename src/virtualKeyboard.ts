import { eventBus } from "./eventBus";

export function attachVirtualKeyboardListeners() {
  document.querySelectorAll(".keyboard-key").forEach((letterEl) => {
    letterEl.addEventListener("click", () => {
      const { key } = (letterEl as HTMLElement).dataset;

      if (key) {
        eventBus.emit("syntheticinput", key);
      }
    });
  });
}
