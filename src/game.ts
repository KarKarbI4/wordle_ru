import { MAX_ATTEMPTS } from "./constants";
import { createNanoEvents } from "nanoevents";
import { dictionary } from "./dictionary";

const solution = "КОШКА";

type LetterState = "gray" | "yellow" | "green";

export type AttemptResult = LetterState[];

export type KeyboardState = { [key: string]: LetterState };

type GameState = {
  keyboardState: KeyboardState;
  currentAttemptIndex: number;
};

interface GameEvents {
  attemptcommit: (options: {
    attemptIndex: number;
    attempt: string;
    attemptResult: AttemptResult;
    keyboardState: KeyboardState;
  }) => void;
  gamewin: () => void;
  gamefail: () => void;
  notindictionary: () => void;
}

export class Game {
  keyboardState: KeyboardState;
  currentAttemptIndex: number;

  private emitter = createNanoEvents<GameEvents>();

  constructor({ keyboardState, currentAttemptIndex }: GameState) {
    this.keyboardState = keyboardState;
    this.currentAttemptIndex = currentAttemptIndex;
  }

  on<E extends keyof GameEvents>(event: E, callback: GameEvents[E]) {
    return this.emitter.on(event, callback);
  }

  commitAttempt(attempt: string) {
    if (!dictionary.has(attempt)) {
      this.emitter.emit("notindictionary");
      return false;
    }

    if (attempt === solution) {
      this.emitter.emit("gamewin");
    } else if (this.currentAttemptIndex >= MAX_ATTEMPTS - 1) {
      this.emitter.emit("gamefail");
    }

    const attemptResult = calculateAttemptResult({ solution, attempt });
    this.keyboardState = updateKeyboardState(
      this.keyboardState,
      attempt,
      attemptResult
    );

    this.emitter.emit("attemptcommit", {
      attemptIndex: this.currentAttemptIndex,
      attempt,
      attemptResult,
      keyboardState: this.keyboardState,
    });

    this.currentAttemptIndex += 1;
    return true;
  }
}

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

export function updateKeyboardState(
  currentState: KeyboardState,
  attempt: string,
  attemptResult: AttemptResult
) {
  const newState = { ...currentState };

  for (let i = 0; i < attempt.length; i++) {
    const letter = attempt[i];

    if (attemptResult[i] === "green") {
      newState[letter] = "green";
    } else if (attemptResult[i] === "yellow" && newState[letter] !== "green") {
      newState[letter] = "yellow";
    } else if (attemptResult[i] === "gray" && !currentState[letter]) {
      newState[letter] = "gray";
    }
  }

  return newState;
}
