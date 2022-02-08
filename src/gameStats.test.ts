import { describe, expect, test } from "vitest";
import { calculateGameStats } from "./gameStats";

describe("Test calculateGameStats", () => {
  test("Game win", () => {
    const currentState = {
      numberOfTheDay: 0,
      totalPlayed: 5,
      totalWins: 10,
      currentStreak: 1,
      maxStreak: 1,
    };
    expect(
      calculateGameStats({
        status: "win",
        currentState,
        numberOfTheDay: 1,
      })
    ).toEqual({
      numberOfTheDay: 1,
      totalPlayed: 6,
      totalWins: 11,
      currentStreak: 2,
      maxStreak: 2,
    });
  });

  test("Game fail", () => {
    const currentState = {
      numberOfTheDay: 0,
      totalPlayed: 3,
      totalWins: 5,
      currentStreak: 50,
      maxStreak: 100,
    };
    expect(
      calculateGameStats({
        status: "fail",
        currentState,
        numberOfTheDay: 1,
      })
    ).toEqual({
      numberOfTheDay: 1,
      totalPlayed: 4,
      totalWins: 5,
      currentStreak: 0,
      maxStreak: 100,
    });
  });

  test("Game win. But day missed", () => {
    const currentState = {
      numberOfTheDay: 0,
      totalPlayed: 5,
      totalWins: 10,
      currentStreak: 1,
      maxStreak: 1,
    };
    expect(
      calculateGameStats({
        status: "win",
        currentState,
        numberOfTheDay: 2, // skipped 1 day
      })
    ).toEqual({
      numberOfTheDay: 2,
      totalPlayed: 6,
      totalWins: 11,
      currentStreak: 1,
      maxStreak: 1,
    });
  });
});
