import type { Game, AttemptResult } from "./game";
import { calcNumberOfTheDay } from "./solutionPicker";
import { initAttempts } from "./ui/gameField";

export type GameSessionStore = {
  attempts: string[];
  attemptResults: AttemptResult[];
  numberOfTheDay: number;
};

function saveGameSession(gameSession: GameSessionStore): void {
  localStorage.setItem("game_session", JSON.stringify(gameSession));
}

export function loadGameSession(): GameSessionStore | null {
  const gameSessionString = localStorage.getItem("game_session");
  if (gameSessionString) {
    return JSON.parse(gameSessionString);
  }

  return null;
}

export function attachGameSessionStore({
  game,
  startWordDate,
  currentDate,
}: {
  game: Game;
  startWordDate: Date;
  currentDate: Date;
}) {
  let prevGameSession = loadGameSession();

  // restore game session
  if (
    prevGameSession &&
    prevGameSession.numberOfTheDay ===
      calcNumberOfTheDay(startWordDate, currentDate)
  ) {
    initAttempts(prevGameSession.attempts.length);
    for (const attempt of prevGameSession.attempts) {
      game.commitAttempt(attempt);
    }
  } else {
    prevGameSession = null;
  }

  game.on("attemptcommit", ({ attempt, attemptResult }) => {
    if (prevGameSession) {
      prevGameSession.attempts.push(attempt);
      prevGameSession.attemptResults.push(attemptResult);
    } else {
      prevGameSession = {
        attempts: [attempt],
        attemptResults: [attemptResult],
        numberOfTheDay: calcNumberOfTheDay(startWordDate, currentDate),
      };
    }

    saveGameSession(prevGameSession);
  });
}
