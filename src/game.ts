import { dictionary } from "./dictionary";

const solution = "кошка";

type LetterState = "gray" | "yellow" | "green";

type AttemptResult = LetterState[];

const attempt: AttemptResult = ["gray", "yellow", "green", "green", "green"];

function commitAttempt(attempt: string) {
  if (attempt === solution) {
    // ui.win();
    return;
  }
  if (!dictionary.has(attempt)) {
    // ui.notInDictionary();
    return;
  }

  const attemptResult = calculateAttemptResult({ solution, attempt });
  // ui.paintAttempt(attemptResult);
  // saveStateToLS(attemptResult);
}

function saveAttemptToLS() {}

export function calculateAttemptResult({
  solution,
  attempt,
}: {
  solution: string;
  attempt: string;
}): AttemptResult {
  const attemptResult: AttemptResult = [];

  const letterCount: { [letter: string]: number } = {};

  // Count letters of each type
  for (const letter of solution) {
    if (!(letter in letterCount)) {
      letterCount[letter] = 0;
    }

    letterCount[letter] += 1;
  }

  // Find green letters
  for (let i = 0; i < attempt.length; i++) {
    const letter = attempt[i];
    if (letter === solution[i]) {
      attemptResult[i] = "green";
      letterCount[letter] -= 1;
    }
  }

  // Find yellow and gray letters
  for (let i = 0; i < attempt.length; i++) {
    if (attemptResult[i]) {
      continue;
    }

    const letter = attempt[i];
    if (solution.includes(letter) && letterCount[letter] > 0) {
      attemptResult[i] = "yellow";
      letterCount[letter] -= 1;
    } else {
      attemptResult[i] = "gray";
    }
  }

  return attemptResult;
}
