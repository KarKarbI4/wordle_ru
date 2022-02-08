import { loadGameStats } from "../gameStats";
import { showModal } from "./modal";

const statsButton = document.querySelector(".wordle-header__stats");

statsButton?.addEventListener("click", () => {
  showModal(loadGameStats());
});
