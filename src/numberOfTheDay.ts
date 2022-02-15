import { calcNumberOfTheDay } from "./solutionPicker";

export const startWordDate = new Date(2022, 1, 6); // 6 марта 2022 года
export const currentDate = new Date();
export const numberOfTheDay = calcNumberOfTheDay(startWordDate, currentDate);
