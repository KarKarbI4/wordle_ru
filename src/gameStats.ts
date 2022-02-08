type GameStats = {
  totalPlayed: number;
  totalWins: number;
  currentStreak: number;
  maxStreak: number;
  numberOfTheDay: number;
};

export function loadGameStats({
  numberOfTheDay,
}: {
  numberOfTheDay: number;
}): GameStats {
  const gameStats = localStorage.getItem("game_stats");
  if (gameStats) {
    return JSON.parse(gameStats) as GameStats;
  }

  return {
    numberOfTheDay,
    totalPlayed: 0,
    totalWins: 0,
    currentStreak: 0,
    maxStreak: 0,
  };
}

export function saveGameStats(stats: GameStats): void {
  localStorage.setItem("game_stats", JSON.stringify(stats));
}

export function calculateGameStats({
  status,
  currentState,
  numberOfTheDay,
}: {
  status: "win" | "fail";
  currentState: GameStats;
  numberOfTheDay: number;
}): GameStats {
  const totalPlayed = currentState.totalPlayed + 1;

  const totalWins =
    status === "win" ? currentState.totalWins + 1 : currentState.totalWins;

  let currentStreak: number;
  if (status === "win") {
    const isNextDay = numberOfTheDay === currentState.numberOfTheDay + 1;
    currentStreak = isNextDay ? currentState.currentStreak + 1 : 1;
  } else {
    currentStreak = 0;
  }

  const maxStreak = Math.max(currentState.maxStreak, currentStreak);

  return {
    totalPlayed,
    totalWins,
    currentStreak,
    maxStreak,
    numberOfTheDay,
  };
}
