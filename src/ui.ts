import { ATTEMPT_LENGTH } from "./constants";

const getAttemptEl = (attemptIndex: number) =>
  document.querySelector(`.attempt:nth-child(${attemptIndex + 1})`);

const getLetterEl = (attemptEl: Element, letterIndex: number) =>
  attemptEl.querySelector(
    `.letter:nth-child(${letterIndex + 1}) .letter-inner`
  );

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
    }
  }
}
