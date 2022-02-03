import { ATTEMPT_LENGTH } from "../constants";
import { AttemptResult } from "../game";
import { applyAnimationOnce } from "./lib/applyAnimationOnce";

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
