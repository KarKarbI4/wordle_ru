import { MAX_ATTEMPTS } from "./../constants";
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
  output.classList.add("game-stats");

  output.appendChild(renderHeader("Статистика"));
  output.appendChild(renderStatsMetrics({ stats }));
  output.appendChild(renderHeader("Распределение попыток"));
  output.appendChild(renderGuessDistribution({ stats }));

  return output;
}

function renderHeader(text: string) {
  const headerEl = document.createElement("div");
  headerEl.innerText = text;
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

function renderGuessDistributionItem({
  attemptsCount,
  gamesCount,
  rate,
}: {
  attemptsCount: number;
  gamesCount: number;
  rate: number;
}): HTMLElement {
  const container = document.createElement("div");
  container.classList.add("guess-dist__item");

  container.style.setProperty("--guess-distribution-metric-rate", `${rate}%`);

  const idEl = document.createElement("span");
  idEl.classList.add("guess-dist__item-id");
  idEl.innerText = attemptsCount.toString();

  const metricEl = document.createElement("div");
  metricEl.classList.add("guess-dist__item-metric");
  metricEl.innerText = gamesCount.toString();

  container.appendChild(idEl);
  container.appendChild(metricEl);

  return container;
}

function renderGuessDistribution({ stats }: { stats: GameStats }): HTMLElement {
  const container = document.createElement("div");
  container.classList.add("guess-dist");
  const maxGamesCount = Math.max(...Object.values(stats.guessDistribution));

  for (let attemptsCount = 1; attemptsCount <= MAX_ATTEMPTS; attemptsCount++) {
    const gamesCount = stats.guessDistribution[attemptsCount];
    const rate = (gamesCount / maxGamesCount) * 100;

    const item = renderGuessDistributionItem({
      attemptsCount,
      gamesCount,
      rate,
    });
    container.appendChild(item);
  }

  return container;
}
