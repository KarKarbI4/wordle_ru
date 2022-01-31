import { ATTEMPT_LENGTH } from "./constants";
import { KeyboardState, AttemptResult } from "./game";
import "./header.ts";
const getAttemptEl = (attemptIndex: number) => {
  const attemptEl = document.querySelector<HTMLElement>(
    `.attempt:nth-child(${attemptIndex + 1})`
  );

  if (!attemptEl) {
    throw new Error("Attempt element not found");
  }

  return attemptEl;
};

const getLetterEl = (attemptEl: Element, letterIndex: number) => {
  const letterEl = attemptEl.querySelector<HTMLElement>(
    `.letter:nth-child(${letterIndex + 1}) .letter-inner`
  );

  if (!letterEl) {
    throw new Error("Letter element not found");
  }

  return letterEl;
};

const getKeyboardKeyEl = (key: string) => {
  const keyboardEl = document.querySelector<HTMLElement>(
    `.keyboard-key[data-key="${key}"]`
  );

  if (!keyboardEl) {
    throw new Error("Keyboard element not found");
  }

  return keyboardEl;
};

const getNotificationEl = () => {
  const notificationEl = document.querySelector<HTMLElement>("#notification");

  if (!notificationEl) {
    throw new Error("Notification element not found");
  }

  return notificationEl;
};

export function setAttempt(attempt: string, attemptIndex: number) {
  const attemptEl = getAttemptEl(attemptIndex);

  for (let letterIndex = 0; letterIndex + 1 <= ATTEMPT_LENGTH; letterIndex++) {
    const letterEl = getLetterEl(attemptEl, letterIndex);
    const letter = attempt[letterIndex] ?? "";

    if (letterEl.textContent !== letter) {
      letterEl.innerHTML = letter;
      popLetter(letterEl);
    }
  }
}

export function setAttemptResult(
  attemptIndex: number,
  attemptResult: AttemptResult
) {
  const attemptEl = getAttemptEl(attemptIndex);

  for (let letterIndex = 0; letterIndex + 1 <= ATTEMPT_LENGTH; letterIndex++) {
    const letterEl = getLetterEl(attemptEl, letterIndex);

    letterEl.parentElement!.classList.add(
      "letter-reveal",
      `letter-${attemptResult[letterIndex]}`
    );
  }
}

export function rejectAttempt(attemptIndex: number) {
  applyAnimationOnce(getAttemptEl(attemptIndex), "attempt-shake");
}

function popLetter(letterEl: HTMLElement) {
  applyAnimationOnce(letterEl, "letter-pop");
}

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

export function notify(text: string, timeoutMs: number = 5000) {
  const notificationEl = document.createElement("div");
  notificationEl.classList.add("notification");
  notificationEl.innerHTML = text;
  document.body.appendChild(notificationEl);

  setTimeout(() => {
    document.body.removeChild(notificationEl);
  }, timeoutMs);
}

export function applyAnimationOnce(
  element: HTMLElement,
  className: string,
  animationName: string = className.split("-").pop()!
) {
  return new Promise<void>((resolve) => {
    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === animationName) {
        element.classList.remove(className);
        element.removeEventListener("animationend", handleAnimationEnd);
        resolve();
      }
    };

    element.classList.add(className);
    element.addEventListener("animationend", handleAnimationEnd);
  });
}
