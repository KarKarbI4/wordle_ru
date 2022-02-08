import { Game } from "./game";
import { calcNumberOfTheDay } from "./solutionPicker";
import { initAttempts } from "./ui/gameField";

type GameSessionStore = {
  attempts: string[];
  numberOfTheDay: number;
};

function saveGameSession(gameSession: GameSessionStore): void {
  localStorage.setItem("game_session", JSON.stringify(gameSession));
}

function loadGameSession(): GameSessionStore | null {
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

  game.on("attemptcommit", ({ attempt }) => {
    if (prevGameSession) {
      prevGameSession.attempts.push(attempt);
    } else {
      prevGameSession = {
        attempts: [attempt],
        numberOfTheDay: calcNumberOfTheDay(startWordDate, currentDate),
      };
    }

    saveGameSession(prevGameSession);
  });
}
