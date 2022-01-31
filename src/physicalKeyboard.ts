import { eventBus } from "./eventBus";

const layoutMapping: Record<number, string> = {
  81: "й",
  87: "ц",
  69: "у",
  82: "к",
  84: "е",
  89: "н",
  85: "г",
  73: "ш",
  79: "щ",
  80: "з",
  219: "х",
  221: "ъ",
  65: "ф",
  83: "ы",
  68: "в",
  70: "а",
  71: "п",
  72: "р",
  74: "о",
  75: "л",
  76: "д",
  186: "ж",
  222: "э",
  90: "я",
  88: "ч",
  67: "с",
  86: "м",
  66: "и",
  78: "т",
  77: "ь",
  188: "б",
  190: "ю",
};

export function attachPhysicalKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    if (
      e.key === "Backspace" ||
      e.key === "Enter" ||
      e.key.match(/[а-яА-ЯёЁ]/)
    ) {
      eventBus.emit("syntheticinput", e.key);
    } else if (layoutMapping[e.keyCode]) {
      eventBus.emit("syntheticinput", layoutMapping[e.keyCode]);
    }
  });
}
