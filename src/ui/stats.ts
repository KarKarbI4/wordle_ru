import { GameStats } from "../gameStats";

function statsItem({ value, text }: { value: number; text: string }) {
  const valueElement = document.createElement("span");
  valueElement.innerText = value.toString();
  valueElement.classList.add("game-stats__item-value");

  const textElement = document.createElement("span");
  textElement.innerText = text;
  textElement.classList.add("game-stats__item-text");

  const statsItemContainer = document.createElement("div");

  statsItemContainer.classList.add("game-stats__item");
  statsItemContainer.appendChild(valueElement);
  statsItemContainer.appendChild(textElement);

  return statsItemContainer;
}

export function renderStats({ stats }: { stats: GameStats }): HTMLElement {
  const output = document.createElement("div");
  output.appendChild(renderHeader());
  output.appendChild(renderStatsMetrics({ stats }));

  return output;
}

function renderHeader() {
  const headerEl = document.createElement("div");
  headerEl.innerText = "Статистика";
  headerEl.classList.add("game-stats__header");
  return headerEl;
}

function renderStatsMetrics({ stats }: { stats: GameStats }): HTMLElement {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("game-stats__metrics");

  statsContainer.appendChild(
    statsItem({ value: stats.totalPlayed, text: "Played" })
  );
  const winRate = stats.totalPlayed
    ? Math.floor((stats.totalWins / stats.totalPlayed) * 100)
    : 0;
  statsContainer.appendChild(statsItem({ value: winRate, text: "Win %" }));
  statsContainer.appendChild(
    statsItem({ value: stats.currentStreak, text: "Current Streak" })
  );
  statsContainer.appendChild(
    statsItem({ value: stats.maxStreak, text: "Max Streak" })
  );

  return statsContainer;
}
