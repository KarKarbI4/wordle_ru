import { showStatsModal } from "../showStatsModal";
import { showRules } from "./rules";

const statsButton = document.querySelector(".wordle-header__stats");

statsButton?.addEventListener("click", () => {
  showStatsModal();
});

const rulesButton = document.querySelector(".wordle-header__rules");

rulesButton?.addEventListener("click", () => {
  showRules();
});
