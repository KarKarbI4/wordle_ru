import { eventBus } from "./eventBus";

export function attachPhysicalKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    if (
      e.key === "Backspace" ||
      e.key === "Enter" ||
      e.key.match(/[а-яА-ЯёЁ]/)
    ) {
      eventBus.emit("syntheticinput", e.key);
    }
  });
}
