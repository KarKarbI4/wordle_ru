import { dictionary } from "./dictionary";
import { solutions } from "./solutions";
import { test, expect } from "vitest";

test("solutions является сабсетом dictionary", () => {
  solutions.forEach((solution) => {
    expect(dictionary.has(solution), solution).toBe(true);
  });
});
