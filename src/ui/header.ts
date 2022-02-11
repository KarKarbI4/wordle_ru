import { showStatsModal } from "../showStatsModal";

const statsButton = document.querySelector(".wordle-header__stats");

statsButton?.addEventListener("click", () => {
  showStatsModal();
});
