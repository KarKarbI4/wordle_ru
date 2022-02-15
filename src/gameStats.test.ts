import { describe, expect, test } from "vitest";
import { calculateGameStats } from "./gameStats";

describe("Test calculateGameStats", () => {
  const defaultGuessDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 10,
    5: 0,
    6: 0,
  };

  test("Game win", () => {
    const currentState = {
      totalPlayed: 5,
      totalWins: 10,
      currentStreak: 1,
      maxStreak: 1,
      latestFinishedGame: {
        attemptsCount: -1,
        numberOfTheDay: 0,
        status: "fail" as const,
      },
      guessDistribution: defaultGuessDistribution,
    };
    expect(
      calculateGameStats({
        status: "win",
        currentState,
        numberOfTheDay: 1,
        attemptsCount: 4,
      })
    ).toEqual({
      totalPlayed: 6,
      totalWins: 11,
      currentStreak: 2,
      maxStreak: 2,
      latestFinishedGame: {
        status: "win",
        attemptsCount: 4,
        numberOfTheDay: 1,
      },
      guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 11,
        5: 0,
        6: 0,
      },
    });
  });

  test("Game fail", () => {
    const currentState = {
      numberOfTheDay: 0,
      totalPlayed: 3,
      totalWins: 5,
      currentStreak: 50,
      maxStreak: 100,
      latestFinishedGame: {
        attemptsCount: -1,
        numberOfTheDay: -1,
        status: "fail" as const,
      },
      guessDistribution: defaultGuessDistribution,
    };
    expect(
      calculateGameStats({
        status: "fail",
        currentState,
        numberOfTheDay: 1,
        attemptsCount: 4,
      })
    ).toEqual({
      latestFinishedGame: {
        numberOfTheDay: 1,
        status: "fail",
        attemptsCount: 4,
      },
      totalPlayed: 4,
      totalWins: 5,
      currentStreak: 0,
      maxStreak: 100,
      guessDistribution: defaultGuessDistribution,
    });
  });

  test("Game win. But day missed", () => {
    const currentState = {
      numberOfTheDay: 0,
      totalPlayed: 5,
      totalWins: 10,
      currentStreak: 1,
      maxStreak: 1,
      latestFinishedGame: {
        attemptsCount: -1,
        numberOfTheDay: -1,
        status: "fail" as const,
      },
      guessDistribution: defaultGuessDistribution,
    };
    expect(
      calculateGameStats({
        status: "win",
        currentState,
        attemptsCount: 4,
        numberOfTheDay: 2, // skipped 1 day
      })
    ).toEqual({
      totalPlayed: 6,
      totalWins: 11,
      currentStreak: 1,
      maxStreak: 1,
      latestFinishedGame: {
        status: "win",
        numberOfTheDay: 2,
        attemptsCount: 4,
      },
      guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 11,
        5: 0,
        6: 0,
      },
    });
  });
});
