import { describe, expect, test, vi } from "vitest";
import {
  calculateAttemptResult,
  updateKeyboardState,
  KeyboardState,
  Game,
  GameState,
  AttemptResult,
} from "./game";

describe("Test Game class", () => {
  const defaultStartState: GameState = {
    keyboardState: {},
    currentAttemptIndex: 0,
    solution: "КОШКА",
    maxAttempts: 6,
  };

  test("Слова нет в словаре", () => {
    const game = new Game(defaultStartState);
    const mockedEventHandler = vi.fn(() => {});

    game.on("notindictionary", mockedEventHandler);

    game.commitAttempt("АУЦАЯ");

    expect(mockedEventHandler).toHaveBeenCalledOnce();
    expect(mockedEventHandler).toBeCalledWith<
      [
        {
          attemptIndex: number;
          attempt: string;
        }
      ]
    >({ attemptIndex: 0, attempt: "АУЦАЯ" });
  });

  test("Очередная попытка", () => {
    const game = new Game(defaultStartState);
    const mockedEventHandler = vi.fn(() => {});

    game.on("attemptcommit", mockedEventHandler);

    game.commitAttempt("СОСЕД");

    expect(game.status).toBe("in_progress");
    expect(mockedEventHandler).toHaveBeenCalledOnce();
    expect(mockedEventHandler).toBeCalledWith<
      [
        {
          attemptIndex: number;
          attempt: string;
          attemptResult: AttemptResult;
          keyboardState: KeyboardState;
        }
      ]
    >({
      attemptIndex: 0,
      attempt: "СОСЕД",
      attemptResult: ["gray", "green", "gray", "gray", "gray"],
      keyboardState: {
        С: "gray",
        О: "green",
        Е: "gray",
        Д: "gray",
      },
    });
  });

  test("Конец игры, выигрыш", () => {
    const game = new Game(defaultStartState);
    const mockedEventHandler = vi.fn(() => {});

    game.on("gamewin", mockedEventHandler);

    game.commitAttempt("КОШКА");

    expect(game.status).toBe("finished");
    expect(mockedEventHandler).toHaveBeenCalledOnce();
    expect(mockedEventHandler).toBeCalledWith<
      [
        {
          attemptIndex: number;
        }
      ]
    >({
      attemptIndex: 0,
    });
  });

  test("Конец игры, проигрыш", () => {
    const game = new Game({ ...defaultStartState, currentAttemptIndex: 5 });
    const mockedEventHandler = vi.fn(() => {});

    game.on("gamefail", mockedEventHandler);

    game.commitAttempt("ПУПОК");

    expect(game.status).toBe("finished");
    expect(mockedEventHandler).toHaveBeenCalledOnce();
    expect(mockedEventHandler).toBeCalledWith<
      [
        {
          solution: string;
          attemptIndex: number;
        }
      ]
    >({
      solution: "КОШКА",
      attemptIndex: 5,
    });
  });

  test("Тест на флоу игры. Выигрыш c последней попытки", () => {
    //given
    const game = new Game({
      ...defaultStartState,
      solution: "СИДОР",
      maxAttempts: 3,
    });
    const mockedNotInDictionary = vi.fn(() => {});
    const mockedCommitAttempt = vi.fn(() => {});
    const mockedGameEnd = vi.fn(() => {});

    game.on("notindictionary", mockedNotInDictionary);
    game.on("attemptcommit", mockedCommitAttempt);
    game.on("gamewin", mockedGameEnd);
    game.on("gamefail", mockedGameEnd);

    // when
    game.commitAttempt("СТРАЖ");
    game.commitAttempt("ИНТИМ");

    // слова нет в словаре
    game.commitAttempt("АУБЬУ");

    game.commitAttempt("СИДОР");

    // then
    expect(mockedNotInDictionary).toHaveBeenCalledOnce();
    expect(mockedNotInDictionary).toHaveBeenCalledWith({
      attemptIndex: 2,
      attempt: "АУБЬУ",
    });

    expect(mockedGameEnd).toHaveBeenCalledOnce();
    expect(mockedGameEnd).toHaveBeenCalledWith({
      attemptIndex: 2,
    });

    expect(mockedCommitAttempt).toHaveBeenNthCalledWith(1, {
      attemptIndex: 0,
      attempt: "СТРАЖ",
      attemptResult: ["green", "gray", "yellow", "gray", "gray"],
      keyboardState: {
        С: "green",
        Т: "gray",
        Р: "yellow",
        А: "gray",
        Ж: "gray",
      },
    });
    expect(mockedCommitAttempt).toHaveBeenNthCalledWith(2, {
      attemptIndex: 1,
      attempt: "ИНТИМ",
      attemptResult: ["yellow", "gray", "gray", "gray", "gray"],
      keyboardState: {
        С: "green",
        Т: "gray",
        Р: "yellow",
        А: "gray",
        Ж: "gray",
        И: "yellow",
        Н: "gray",
        М: "gray",
      },
    });
    expect(mockedCommitAttempt).toHaveBeenNthCalledWith(3, {
      attemptIndex: 2,
      attempt: "СИДОР",
      attemptResult: ["green", "green", "green", "green", "green"],
      keyboardState: {
        С: "green",
        Т: "gray",
        Р: "green",
        А: "gray",
        Ж: "gray",
        И: "green",
        Н: "gray",
        М: "gray",
        Д: "green",
        О: "green",
      },
    });
  });
});

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

describe("Test updateKeyboardState", () => {
  test("Все кейсы в одном, лол", () => {
    const currentState: KeyboardState = {
      а: "gray",
      б: "yellow",
      в: "green",
    };

    expect(
      updateKeyboardState(currentState, "абвгд", [
        "gray",
        "green",
        "yellow",
        "gray",
        "yellow",
      ])
    ).toEqual({
      а: "gray",
      б: "green",
      в: "green",
      г: "gray",
      д: "yellow",
    });
  });

  test("Обновление keyboardState с двумя одинаковыми буквами в попытке", () => {
    const currentState: KeyboardState = {};

    expect(
      updateKeyboardState(currentState, "ИНТИМ", [
        "yellow",
        "gray",
        "gray",
        "gray",
        "gray",
      ])
    ).toEqual({
      И: "yellow",
      Н: "gray",
      Т: "gray",
      М: "gray",
    });
  });
});
