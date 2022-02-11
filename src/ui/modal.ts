import { GameStats } from "../gameStats";
import { applyAnimationOnce } from "./lib/applyAnimationOnce";

const crossElement = document.querySelector(".modal-close");

crossElement?.addEventListener("click", () => {
  closeModal();
});

const backdropElement = document.querySelector(".modal-backdrop");

backdropElement?.addEventListener("click", (event) => {
  closeModal();
});

function statsItem({ value, text }: { value: number; text: string }) {
  const valueElement = document.createElement("span");
  valueElement.innerText = value.toString();
  valueElement.classList.add("stats-item__value");

  const textElement = document.createElement("span");
  textElement.innerText = text;
  textElement.classList.add("stats-item__text");

  const statsItemContainer = document.createElement("div");

  statsItemContainer.classList.add("stats-item");
  statsItemContainer.appendChild(valueElement);
  statsItemContainer.appendChild(textElement);

  return statsItemContainer;
}

function renderStats({
  modal,
  stats,
}: {
  modal: HTMLElement;
  stats: GameStats;
}) {
  const statsContainer = modal.querySelector(".modal-stats");
  if (!statsContainer) {
    return;
  }

  statsContainer.innerHTML = "";

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
}

export function showModal(stats: GameStats) {
  const modal = document.querySelector<HTMLElement>("#endGameModal");
  if (!modal) {
    return;
  }

  modal.classList.remove("modal-hidden", "modal-hidden-animate");
  renderStats({ modal, stats });
}

export async function closeModal() {
  const modal = document.querySelector<HTMLElement>("#endGameModal");

  if (!modal) {
    throw new Error("Modal element not found");
  }

  await applyAnimationOnce(
    modal,
    "modal-hidden-animate",
    "disappear-animation"
  );
  modal.classList.add("modal-hidden");
}
