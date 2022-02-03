import { eventBus } from "../eventBus";
import { KeyboardState } from "../game";

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

const getKeyboardKeyEl = (key: string) => {
  const keyboardEl = document.querySelector<HTMLElement>(
    `.keyboard-key[data-key="${key}"]`
  );

  if (!keyboardEl) {
    throw new Error("Keyboard element not found");
  }

  return keyboardEl;
};

export function setKeyboardState(keyboardState: KeyboardState) {
  for (const [key, state] of Object.entries(keyboardState)) {
    const keyEl = getKeyboardKeyEl(key.toLowerCase());
    keyEl?.classList.remove(
      "keyboard-key-green",
      "keyboard-key-yellow",
      "keyboard-key-gray"
    );
    keyEl?.classList.add(`keyboard-key-${state}`);
  }
}
