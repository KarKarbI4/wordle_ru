function updateTicker(element: HTMLElement) {
  element.innerText = formatMs(untilNextDayInMs());
}

function untilNextDayInMs() {
  const now = new Date();
  const nextDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  return Math.max(nextDay.getTime() - now.getTime(), 0);
}

function formatMs(ms: number) {
  const timeInSeconds = ms / 1000;
  const hours = Math.floor(timeInSeconds / 60 / 60);
  const minutes = Math.floor((timeInSeconds / 60) % 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const zeroed = (n: number) => (n < 10 ? "0" + n : n);
  return `${zeroed(hours)}:${zeroed(minutes)}:${zeroed(seconds)}`;
}

setInterval(() => updateTickerElements(), 1000);

let tickers: HTMLElement[] = [];

function updateTickerElements() {
  const tickersToDelete: HTMLElement[] = [];

  for (const ticker of tickers) {
    if (document.body.contains(ticker)) {
      updateTicker(ticker);
    } else {
      tickersToDelete.push(ticker);
    }
  }

  tickers = tickers.filter((ticker) => !tickersToDelete.includes(ticker));
}

function watchTickerElement(element: HTMLElement) {
  tickers.push(element);
}

export function renderWordleTicker(): HTMLElement {
  const element = document.createElement("div");
  updateTicker(element);
  watchTickerElement(element);

  return element;
}
