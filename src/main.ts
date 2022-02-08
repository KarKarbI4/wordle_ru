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
import * as modal from "./ui/modal";
import { MAX_ATTEMPTS } from "./constants";
import { calculateGameStats, loadGameStats, saveGameStats } from "./gameStats";
import { calcNumberOfTheDay, solutionForDate } from "./solutionPicker";
import { solutions } from "./solutions";
import { attachGameSessionStore } from "./gameSessionStore";

const startWordDate = new Date(2022, 1, 6); // 6 марта 2022 года
const currentDate = new Date();
const numberOfTheDay = calcNumberOfTheDay(startWordDate, currentDate);

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

function onLettersLimitCallback() {
  console.log("ПЕРЕСТАНЬ НАБИРАТЬ");
}

function onLetterType(attempt: string) {
  gameField.setAttempt({ attempt, attemptIndex: game.currentAttemptIndex });
}

function onEnter(attempt: string) {
  const success = game.commitAttempt(attempt);
  return { success };
}

function updateGameStats(status: "win" | "fail") {
  const prevStats = loadGameStats({ numberOfTheDay });
  const newStats = calculateGameStats({
    status,
    currentState: prevStats,
    numberOfTheDay,
  });
  saveGameStats(newStats);
}

game.on("attemptcommit", (event) => {
  gameField.setAttemptResult(event.attemptIndex, event.attemptResult);
  gameField.setAttempt({
    attempt: event.attempt,
    attemptIndex: event.attemptIndex,
  });
  setKeyboardState(event.keyboardState);
});

game.on("notindictionary", (event) => {
  notify("Такого слова нет в игре");
  gameField.rejectAttempt(event.attemptIndex);
});

game.on("gamefail", (event) => {
  notify(event.solution);
  updateGameStats("fail");
  deattachKeyboardProcessor();
});

game.on("gamewin", (event) => {
  notify(
    ["Гениально!", "Восхитительно!", "Отлично!!", "Нормик!", "Пронесло!"][
      event.attemptIndex
    ]
  );
  modal.showModal();
  updateGameStats("win");
  deattachKeyboardProcessor();
});

attachGameSessionStore({ game, startWordDate, currentDate });
