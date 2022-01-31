// const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <h1>Govno</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

import { attachKeyboardProcessor } from "./keyboardProcessor";
import { Game } from "./game";
import { attachVirtualKeyboardListeners } from "./virtualKeyboard";
import { attachPhysicalKeyboardListeners } from "./physicalKeyboard";
import {
  setAttempt,
  setAttemptResult,
  setKeyboardState,
  rejectAttempt,
  notify,
} from "./ui";
import * as modal from "./modal";
import { MAX_ATTEMPTS } from "./constants";

console.log("init main.ts");

const game = new Game({
  solution: "КОШКА",
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
  setAttempt(attempt, game.currentAttemptIndex);
}

function onEnter(attempt: string) {
  const success = game.commitAttempt(attempt);
  return { success };
}

game.on("attemptcommit", (event) => {
  setAttemptResult(event.attemptIndex, event.attemptResult);
  setKeyboardState(event.keyboardState);
});

game.on("notindictionary", (event) => {
  notify("Такого слова нет в игре");
  rejectAttempt(event.attemptIndex);
});

game.on("gamefail", (event) => {
  notify(event.solution);
  deattachKeyboardProcessor();
});

game.on("gamewin", (event) => {
  notify(
    ["Гениально!", "Восхитительно!", "Отлично!!", "Нормик!", "Пронесло!"][
      event.attemptIndex
    ]
  );
  modal.showModal();
  deattachKeyboardProcessor();
});
