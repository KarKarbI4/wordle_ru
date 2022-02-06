// for tests
export function diffInDays(lhs: Date, rhs: Date) {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

  return Math.round(
    Math.abs((toUTCTimestamp(rhs) - toUTCTimestamp(lhs)) / oneDay)
  );
}

function toUTCTimestamp(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function numberOfTheDay(startWordDate: Date, date: Date): number {
  return diffInDays(date, startWordDate);
}

export function solutionForDate({
  solutions,
  date,
  startWordDate,
}: {
  solutions: string[];
  date: Date;
  startWordDate: Date;
}): string {
  const solutionIndex = numberOfTheDay(date, startWordDate) % solutions.length;
  return solutions[solutionIndex];
}
