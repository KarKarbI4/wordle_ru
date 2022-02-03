type GameStats = {
  totalPlayed: number;
  totalWins: number;
  currentStreak: number;
  maxStreak: number;
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
  };
}

export function saveGameStats(stats: GameStats): void {
  localStorage.setItem("game_stats", JSON.stringify(stats));
}

export function calculateGameStats({
  status,
  currentState,
}: {
  status: "win" | "fail";
  currentState: GameStats;
}): GameStats {
  const totalPlayed = currentState.totalPlayed + 1;

  const totalWins =
    status === "win" ? currentState.totalWins + 1 : currentState.totalWins;
  const currentStreak = status === "win" ? currentState.currentStreak + 1 : 0;

  const maxStreak = Math.max(currentState.maxStreak, currentStreak);

  return {
    totalPlayed,
    totalWins,
    currentStreak,
    maxStreak,
  };
}
