import { test, expect } from "vitest";
import { diffInDays, solutionForDate } from "./solutionPicker";

const FEBRUARY_INDEX = 1;
const MARCH_INDEX = 2;

test("Проверяем выбор слова на сегодня", () => {
  const solutionsList = ["кошка", "школа", "папич", "пенис"];
  const startWordDate = new Date(2022, FEBRUARY_INDEX, 6);

  expect(
    solutionForDate({
      solutions: solutionsList,
      startWordDate,
      date: new Date(2022, FEBRUARY_INDEX, 8),
    })
  ).toEqual("папич");
});

test("Проверяем выбор слова на сегодня. Со старта игры прошло больше дней, чем слов", () => {
  const solutionsList = ["кошка", "школа", "папич", "пенис"];
  const startWordDate = new Date(2022, FEBRUARY_INDEX, 6);

  expect(
    solutionForDate({
      solutions: solutionsList,
      startWordDate,
      date: new Date(2022, FEBRUARY_INDEX, 15),
    })
  ).toEqual("школа");
});

test("Проверяем выбор слова на сегодня. Проверяем, что работает февраль", () => {
  const solutionsList = ["кошка", "школа", "папич", "пенис"];
  const startWordDate = new Date(2022, FEBRUARY_INDEX, 28);

  expect(
    solutionForDate({
      solutions: solutionsList,
      startWordDate,
      date: new Date(2022, MARCH_INDEX, 1),
    })
  ).toEqual("школа");
});

test("Тест diffInDays", () => {
  const startDate = new Date(2022, FEBRUARY_INDEX, 28);
  const date = new Date(2022, MARCH_INDEX, 1);
  expect(diffInDays(date, startDate)).toBe(1);
});

test("Тест diffInDays. Дата в прошлом", () => {
  const startDate = new Date(2022, FEBRUARY_INDEX, 28);
  const date = new Date(2022, FEBRUARY_INDEX, 25);
  expect(diffInDays(date, startDate)).toBe(3);
});
