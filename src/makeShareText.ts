import { AttemptResult, LetterState } from "./game";

const resultMapping: Record<LetterState, string> = {
  gray: "⬜",
  yellow: "🟨",
  green: "🟩",
} as const;

export function makeShareText({
  numberOfTheDay,
  attemptResults,
  status,
}: {
  numberOfTheDay: number;
  status: "win" | "fail";
  attemptResults: AttemptResult[];
}): string {
  const attemptIndicator =
    status === "win" ? attemptResults.length.toString() : "x";
  const header = `СЛОВЛО ${numberOfTheDay} ${attemptIndicator}/6`;
  const body = attemptsToEmoji(attemptResults);
  const link = document.location.origin + document.location.pathname;

  const footer = `Ссылка на игру:\n${link}`;
  return `${header}\n\n${body}\n\n${footer}\n\n`;
}

function attemptsToEmoji(attemptResults: AttemptResult[]): string {
  return attemptResults.map((row) => attemptToEmoji(row)).join("\n");
}

function attemptToEmoji(attemptResult: AttemptResult): string {
  return attemptResult
    .map((attemptResult) => resultMapping[attemptResult])
    .join("");
}
