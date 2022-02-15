import { loadGameStats } from "./gameStats";
import { numberOfTheDay } from "./numberOfTheDay";
import { showModal } from "./ui/modal";
import { renderStats } from "./ui/stats";

export function showStatsModal() {
  const stats = loadGameStats();
  const statsElement = renderStats({ stats, numberOfTheDay });
  showModal(statsElement);
}
