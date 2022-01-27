import { ATTEMPT_LENGTH } from "./constants";
import { KeyboardState, AttemptResult } from "./game";

const getAttemptEl = (attemptIndex: number) =>
  document.querySelector<HTMLElement>(
    `.attempt:nth-child(${attemptIndex + 1})`
  );

const getLetterEl = (attemptEl: Element, letterIndex: number) =>
  attemptEl.querySelector<HTMLElement>(
    `.letter:nth-child(${letterIndex + 1}) .letter-inner`
  );

const getKeyboardKeyEl = (key: string) =>
  document.querySelector<HTMLElement>(`.keyboard-key[data-key="${key}"]`);

export function setAttempt(attempt: string, attemptIndex: number) {
  const attemptEl = getAttemptEl(attemptIndex);

  if (!attemptEl) {
    throw new Error("Attempt element not found");
  }

  for (let letterIndex = 0; letterIndex + 1 <= ATTEMPT_LENGTH; letterIndex++) {
    const letterEl = getLetterEl(attemptEl, letterIndex);

    if (!letterEl) {
      throw new Error("Letter element not found");
    }

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

  if (!attemptEl) {
    throw new Error("Attempt element not found");
  }

  for (let letterIndex = 0; letterIndex + 1 <= ATTEMPT_LENGTH; letterIndex++) {
    const letterEl = getLetterEl(attemptEl, letterIndex);

    if (!letterEl) {
      throw new Error("Letter element not found");
    }

    letterEl.parentElement!.classList.add(
      "letter-reveal",
      `letter-${attemptResult[letterIndex]}`
    );
  }
}

function popLetter(letterEl: HTMLElement) {
  letterEl.classList.add("letter-pop");
  const handleAnimationEnd = (event: AnimationEvent) => {
    if (event.animationName === "pop") {
      letterEl.classList.remove("letter-pop");
      letterEl.removeEventListener("animationend", handleAnimationEnd);
    }
  };
  letterEl.addEventListener("animationend", handleAnimationEnd);
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
