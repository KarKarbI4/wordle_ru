import { GuessDistribution } from "./gameStats";
export type GuessDistribution = {
  [key: number]: number;
};

export type GameStats = {
  totalPlayed: number;
  totalWins: number;
  currentStreak: number;
  maxStreak: number;
  numberOfTheDay?: number;
  guessDistribution: GuessDistribution;
};

const defaultGuessDistribution: GuessDistribution = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
};

export function loadGameStats(): GameStats {
  const gameStats = localStorage.getItem("game_stats");
  if (gameStats) {
    return JSON.parse(gameStats) as GameStats;
  }

  return {
    totalPlayed: 0,
    totalWins: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: defaultGuessDistribution,
  };
}

export function saveGameStats(stats: GameStats): void {
  localStorage.setItem("game_stats", JSON.stringify(stats));
}

export function calculateGameStats({
  status,
  attemptsCount,
  currentState,
  numberOfTheDay,
}: {
  status: "win" | "fail";
  attemptsCount: number;
  currentState: GameStats;
  numberOfTheDay: number;
}): GameStats {
  const totalPlayed = currentState.totalPlayed + 1;

  const totalWins =
    status === "win" ? currentState.totalWins + 1 : currentState.totalWins;

  let currentStreak: number;
  if (status === "win") {
    const isNextDay =
      currentState.numberOfTheDay !== undefined &&
      numberOfTheDay === currentState.numberOfTheDay + 1;
    currentStreak = isNextDay ? currentState.currentStreak + 1 : 1;
  } else {
    currentStreak = 0;
  }

  const maxStreak = Math.max(currentState.maxStreak, currentStreak);

  const guessDistribution = { ...currentState.guessDistribution };
  if (status === "win") {
    guessDistribution[attemptsCount] =
      currentState.guessDistribution[attemptsCount] + 1;
  }

  return {
    totalPlayed,
    totalWins,
    currentStreak,
    maxStreak,
    numberOfTheDay,
    guessDistribution,
  };
}
