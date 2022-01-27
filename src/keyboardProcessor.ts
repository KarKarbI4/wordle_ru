import { ATTEMPT_LENGTH } from "./constants";
import { eventBus } from "./eventBus";

type KeyboardProcessorOptions = {
  typeCallback?: (currentAttempt: string) => void;
  commitCallback?: (currentAttempt: string) => { success: boolean };
  lettersLimitCallback?: () => void;
};

export function attachKeyboardProcessor({
  typeCallback,
  commitCallback,
  lettersLimitCallback,
}: KeyboardProcessorOptions) {
  let currentAttempt = "";

  const resetAttempt = () => (currentAttempt = "");

  const unsubscribe = eventBus.on("syntheticinput", (key) => {
    const isLimit = currentAttempt.length >= ATTEMPT_LENGTH;

    if (key === "Backspace" && currentAttempt.length > 0) {
      currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
      typeCallback?.(currentAttempt);
    } else if (isLimit && key === "Enter") {
      if (commitCallback) {
        const { success } = commitCallback(currentAttempt);
        if (success) {
          currentAttempt = "";
        }
      }
    } else if (key.match(/[а-яА-ЯёЁ]/)) {
      if (isLimit) {
        lettersLimitCallback?.();
        return;
      }

      currentAttempt += key.toUpperCase();
      typeCallback?.(currentAttempt);
    }
  });

  return unsubscribe;
}
