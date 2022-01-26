// const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <h1>Govno</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

import { attachKeyboardProcessor } from "./keyboardProcessor";
import { setAttempt } from "./ui";
import { attachVirtualKeyboardListeners } from "./virtualKeyboard";
import { attachPhysicalKeyboardListeners } from "./physicalKeyboard";

console.log("init main.ts");

function onType(attempt: string) {
  console.log("type", attempt);
  setAttempt(attempt, 0);
}

function onCommit(attempt: string) {
  console.log("commit", attempt);
}

function onLettersLimitCallback() {
  console.log("ПЕРЕСТАНЬ НАБИРАТЬ");
}

attachKeyboardProcessor({
  typeCallback: onType,
  commitCallback: onCommit,
  lettersLimitCallback: onLettersLimitCallback,
});

attachPhysicalKeyboardListeners();
attachVirtualKeyboardListeners();
