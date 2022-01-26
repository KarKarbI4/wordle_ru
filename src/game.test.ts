import { assert, describe, expect, test } from "vitest";
import { calculateAttemptResult } from "./game";

describe("Test calculateAttemptResult", () => {
  test("Наивная проверка", () => {
    expect(
      calculateAttemptResult({ solution: "кошка", attempt: "нечто" })
    ).toEqual(["gray", "gray", "gray", "gray", "yellow"]);
  });

  test("Проверка с двумя одинаковыми зелёными буквами", () => {
    expect(
      calculateAttemptResult({ solution: "кошка", attempt: "кучка" })
    ).toEqual(["green", "gray", "gray", "green", "green"]);
  });

  test("В солюшне две одинаковые буквы, в аттемпте одна", () => {
    expect(
      calculateAttemptResult({ solution: "кошка", attempt: "сумка" })
    ).toEqual(["gray", "gray", "gray", "green", "green"]);
  });

  test("Проверка с двумя одинаковыми буквами | одна жёлтая, вторая серая", () => {
    expect(
      calculateAttemptResult({ solution: "сумка", attempt: "спрос" })
    ).toEqual(["green", "gray", "gray", "gray", "gray"]);
  });
});
