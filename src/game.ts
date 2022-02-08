import { createNanoEvents } from "nanoevents";
import { dictionary } from "./dictionary";

export type LetterState = "gray" | "yellow" | "green";

export type AttemptResult = LetterState[];

export type KeyboardState = { [key: string]: LetterState };

export type GameState = {
  keyboardState: KeyboardState;
  currentAttemptIndex: number;
  solution: string;
  maxAttempts: number;
};

interface GameEvents {
  attemptcommit: (options: {
    attemptIndex: number;
    attempt: string;
    attemptResult: AttemptResult;
    keyboardState: KeyboardState;
  }) => void;
  gamewin: (options: { attemptIndex: number }) => void;
  gamefail: (options: { solution: string }) => void;
  notindictionary: (options: { attemptIndex: number; attempt: string }) => void;
}

type GameStatus = "in_progress" | "finished";

export class Game {
  keyboardState: KeyboardState;
  currentAttemptIndex: number;
  solution: string;
  maxAttempts: number;
  status: GameStatus;
  private emitter = createNanoEvents<GameEvents>();

  constructor({
    keyboardState,
    currentAttemptIndex,
    solution,
    maxAttempts,
  }: GameState) {
    this.keyboardState = keyboardState;
    this.currentAttemptIndex = currentAttemptIndex;
    this.solution = solution;
    this.maxAttempts = maxAttempts;
    this.status = "in_progress";
  }

  on<E extends keyof GameEvents>(event: E, callback: GameEvents[E]) {
    return this.emitter.on(event, callback);
  }

  commitAttempt(attempt: string) {
    if (!dictionary.has(attempt)) {
      this.emitter.emit("notindictionary", {
        attempt,
        attemptIndex: this.currentAttemptIndex,
      });
      return false;
    }

    if (attempt === this.solution) {
      this.emitter.emit("gamewin", { attemptIndex: this.currentAttemptIndex });
      this.status = "finished";
    } else if (this.currentAttemptIndex >= this.maxAttempts - 1) {
      this.status = "finished";
      this.emitter.emit("gamefail", { solution: this.solution });
    }

    const attemptResult = calculateAttemptResult({
      solution: this.solution,
      attempt,
    });
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

// for test
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

// for test
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
    } else if (attemptResult[i] === "gray" && !newState[letter]) {
      newState[letter] = "gray";
    }
  }

  return newState;
}
