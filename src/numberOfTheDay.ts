import { calcNumberOfTheDay } from "./solutionPicker";

export const startWordDate = new Date(2022, 2, 25); // 25 марта 2022 года
export const currentDate = new Date();
export const numberOfTheDay = calcNumberOfTheDay(startWordDate, currentDate);
