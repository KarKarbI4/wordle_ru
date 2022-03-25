import { markRulesShowed } from "../showRulesOnStart";
import { createInstanceOfTemplate } from "./lib/createInstanceOfTemplate";
import { openModal } from "./modal";

export function showRules() {
  const rulesElement = createInstanceOfTemplate("#rules-modal-content")!;

  openModal(rulesElement).then(() => {
    markRulesShowed();
  });
}
