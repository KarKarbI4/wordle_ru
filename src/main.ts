import { currentDate, startWordDate, numberOfTheDay } from "./numberOfTheDay";
import "./ui/main";
import { attachKeyboardProcessor } from "./keyboardProcessor";
import { Game } from "./game";
import { attachPhysicalKeyboardListeners } from "./physicalKeyboard";
import * as gameField from "./ui/gameField";
import {
  attachVirtualKeyboardListeners,
  setKeyboardState,
} from "./ui/virtualKeyboard";
import { notify } from "./ui/notification";
import { MAX_ATTEMPTS } from "./constants";
import { calculateGameStats, loadGameStats, saveGameStats } from "./gameStats";
import { solutionForDate } from "./solutionPicker";
import { solutions } from "./solutions";
import { attachGameSessionStore } from "./gameSessionStore";
import { showStatsModal } from "./showStatsModal";
import { showRulesOnStart } from "./showRulesOnStart";
import { sendAnalyticsEvent } from "./analytics";

const solution = solutionForDate({
  solutions,
  date: currentDate,
  startWordDate,
});

const game = new Game({
  solution,
  keyboardState: {},
  currentAttemptIndex: 0,
  maxAttempts: MAX_ATTEMPTS,
});

attachPhysicalKeyboardListeners();
attachVirtualKeyboardListeners();
const deattachKeyboardProcessor = attachKeyboardProcessor({
  typeCallback: onLetterType,
  commitCallback: onEnter,
  lettersLimitCallback: onLettersLimitCallback,
});

function onLettersLimitCallback() {}

function onLetterType(attempt: string) {
  gameField.setAttempt({ attempt, attemptIndex: game.currentAttemptIndex });
}

function onEnter(attempt: string) {
  const success = game.commitAttempt(attempt);
  return { success };
}

function updateGameStats({
  status,
  attemptsCount,
}: {
  status: "win" | "fail";
  attemptsCount: number;
}) {
  const prevStats = loadGameStats();
  const newStats = calculateGameStats({
    status,
    currentState: prevStats,
    numberOfTheDay,
    attemptsCount,
  });
  saveGameStats(newStats);
}

function onGameFinish() {
  deattachKeyboardProcessor();
  setTimeout(() => {
    showStatsModal();
  }, 1000);
}

game.on("attemptcommit", (event) => {
  gameField.setAttemptResult(event.attemptIndex, event.attemptResult);
  gameField.setAttempt({
    attempt: event.attempt,
    attemptIndex: event.attemptIndex,
  });
  setKeyboardState(event.keyboardState);
});

attachGameSessionStore({ game, startWordDate, currentDate });
if (game.status === "finished") {
  onGameFinish();
}

game.on("notindictionary", (event) => {
  notify("Такого слова нет в словаре");
  gameField.rejectAttempt(event.attemptIndex);
});

game.on("gamefail", (event) => {
  updateGameStats({ status: "fail", attemptsCount: event.attemptIndex + 1 });
  onGameFinish();
  notify(event.solution);
  sendAnalyticsEvent("game_fail");
  sendAnalyticsEvent("game_finish");
});

game.on("gamewin", (event) => {
  updateGameStats({ status: "win", attemptsCount: event.attemptIndex + 1 });
  onGameFinish();
  notify(
    [
      "Гениально!",
      "Восхитительно!",
      "Отлично!",
      "Хорошо!",
      "Было близко!",
      "Пронесло!",
    ][event.attemptIndex]
  );
  sendAnalyticsEvent("game_win");
  sendAnalyticsEvent("game_finish");
});

showRulesOnStart();
