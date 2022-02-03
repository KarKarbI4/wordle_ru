import { describe, expect, test, vi } from "vitest";
import { calculateGameStats } from "./gameStats";

describe("Test calculateGameStats", () => {
  test("Game win", () => {
    const currentState = {
      totalPlayed: 5,
      totalWins: 10,
      currentStreak: 1,
      maxStreak: 1,
    };
    expect(
      calculateGameStats({
        status: "win",
        currentState,
      })
    ).toEqual({
      totalPlayed: 6,
      totalWins: 11,
      currentStreak: 2,
      maxStreak: 2,
    });
  });

  test("Game fail", () => {
    const currentState = {
      totalPlayed: 3,
      totalWins: 5,
      currentStreak: 50,
      maxStreak: 100,
    };
    expect(
      calculateGameStats({
        status: "fail",
        currentState,
      })
    ).toEqual({
      totalPlayed: 4,
      totalWins: 5,
      currentStreak: 0,
      maxStreak: 100,
    });
  });
});
