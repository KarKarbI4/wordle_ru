import { showRules } from "./ui/rules";

export function showRulesOnStart() {
  const rulesShowed = JSON.parse(
    localStorage.getItem("rules-showed") || "false"
  );
  if (!rulesShowed) {
    showRules();
  }
}

export function markRulesShowed() {
  localStorage.setItem("rules-showed", "true");
}
