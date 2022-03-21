import { MAX_ATTEMPTS } from "./../constants";
import type { GameStats } from "../gameStats";
import { renderWordleTicker } from "./wordleTicker";
import type { GameSessionStore } from "../gameSessionStore";

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

export function renderStats({
  stats,
  numberOfTheDay,
  gameSession,
}: {
  stats: GameStats;
  numberOfTheDay: number;
  gameSession: GameSessionStore;
}): HTMLElement {
  const output = document.createElement("div");
  output.classList.add("game-stats");

  output.appendChild(renderHeader("Статистика"));
  output.appendChild(renderStatsMetrics({ stats }));
  output.appendChild(renderHeader("Распределение попыток"));
  output.appendChild(renderGuessDistribution({ stats, numberOfTheDay }));

  if (stats.latestFinishedGame.numberOfTheDay === numberOfTheDay) {
    output.appendChild(renderFinishedGameBlock());
  }

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
    statsItem({ value: stats.totalPlayed, text: "Сыграно" })
  );
  const winRate = stats.totalPlayed
    ? Math.floor((stats.totalWins / stats.totalPlayed) * 100)
    : 0;
  statsContainer.appendChild(statsItem({ value: winRate, text: "Побед %" }));
  statsContainer.appendChild(
    statsItem({ value: stats.currentStreak, text: "Текущая серия" })
  );
  statsContainer.appendChild(
    statsItem({ value: stats.maxStreak, text: "Макс. серия" })
  );

  return statsContainer;
}

function renderGuessDistributionItem({
  attemptsCount,
  gamesCount,
  rate,
  isCurrentWin,
}: {
  attemptsCount: number;
  gamesCount: number;
  rate: number;
  isCurrentWin: boolean;
}): HTMLElement {
  const container = document.createElement("div");
  container.classList.add("guess-dist__item");

  container.style.setProperty("--guess-distribution-metric-rate", `${rate}%`);

  const idEl = document.createElement("span");
  idEl.classList.add("guess-dist__item-id");
  idEl.innerText = attemptsCount.toString();

  const metricEl = document.createElement("div");
  metricEl.classList.add("guess-dist__item-metric");
  if (isCurrentWin) {
    metricEl.classList.add("guess-dist__item-metric_green");
  }
  metricEl.innerText = gamesCount.toString();

  container.appendChild(idEl);
  container.appendChild(metricEl);

  return container;
}

function renderGuessDistribution({
  stats,
  numberOfTheDay,
}: {
  stats: GameStats;
  numberOfTheDay: number;
}): HTMLElement {
  const container = document.createElement("div");
  container.classList.add("guess-dist");
  const maxGamesCount = Math.max(...Object.values(stats.guessDistribution));
  const hasWinToday =
    numberOfTheDay === stats.latestFinishedGame.numberOfTheDay &&
    stats.latestFinishedGame.status === "win";

  for (let attemptsCount = 1; attemptsCount <= MAX_ATTEMPTS; attemptsCount++) {
    const gamesCount = stats.guessDistribution[attemptsCount];
    const rate = (gamesCount / maxGamesCount) * 100;
    const isCurrentWin =
      hasWinToday && attemptsCount === stats.latestFinishedGame.attemptsCount;

    const item = renderGuessDistributionItem({
      attemptsCount,
      gamesCount,
      rate,
      isCurrentWin,
    });
    container.appendChild(item);
  }

  return container;
}

function renderFinishedGameBlock() {
  const container = document.createElement("div");
  container.classList.add("game-stats__finished-game-container");

  container.appendChild(renderTicker());
  container.appendChild(renderShareButton());

  return container;
}

function renderTicker() {
  const tickerConainer = document.createElement("div");

  const header = renderHeader("Новое Словло");

  const ticker = renderWordleTicker();

  tickerConainer.classList.add("game-stats__ticker");
  tickerConainer.appendChild(header);
  tickerConainer.appendChild(ticker);

  return tickerConainer;
}

function renderShareButton() {
  const element = document.createElement("button");
  element.innerText = "Поделиться";
  element.classList.add("game-stats__share-button");
  element.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  return element;
}
