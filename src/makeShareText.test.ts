import { AttemptResult } from "./game";
import { makeShareText } from "./makeShareText";
import { test, expect } from "vitest";

test("Тест makeShareText win", () => {
  const attemptResults: AttemptResult[] = [
    ["gray", "gray", "gray", "gray", "gray"],
    ["yellow", "yellow", "gray", "green", "gray"],
    ["yellow", "yellow", "yellow", "green", "gray"],
    ["green", "green", "green", "gray", "green"],
    ["green", "green", "green", "green", "green"],
  ];
  const numberOfTheDay = 300;
  const status = "win";

  expect(makeShareText({ attemptResults, status, numberOfTheDay })).toBe(
    `СЛОВЛО 300 5/6

⬜⬜⬜⬜⬜
🟨🟨⬜🟩⬜
🟨🟨🟨🟩⬜
🟩🟩🟩⬜🟩
🟩🟩🟩🟩🟩

`
  );
});

test("Тест makeShareText loose", () => {
  const attemptResults: AttemptResult[] = [
    ["gray", "gray", "gray", "gray", "gray"],
    ["yellow", "yellow", "gray", "green", "gray"],
    ["yellow", "yellow", "yellow", "green", "gray"],
    ["green", "green", "gray", "gray", "gray"],
    ["green", "green", "gray", "yellow", "gray"],
    ["green", "green", "yellow", "yellow", "yellow"],
  ];
  const numberOfTheDay = 69;
  const status = "fail";

  expect(makeShareText({ attemptResults, status, numberOfTheDay })).toBe(
    `СЛОВЛО 69 x/6

⬜⬜⬜⬜⬜
🟨🟨⬜🟩⬜
🟨🟨🟨🟩⬜
🟩🟩⬜⬜⬜
🟩🟩⬜🟨⬜
🟩🟩🟨🟨🟨

`
  );
});
