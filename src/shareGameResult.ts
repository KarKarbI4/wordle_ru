import { makeShareText } from "./makeShareText";
import { loadGameSession } from "./gameSessionStore";
import { notify } from "./ui/notification";
import { loadGameStats } from "./gameStats";

export function shareGameResult() {
  const gameSessionStore = loadGameSession();
  const gameStats = loadGameStats();

  if (!gameSessionStore) {
    notify("Произошла ошибка");
    return;
  }

  if (
    gameStats.latestFinishedGame.numberOfTheDay !==
    gameSessionStore?.numberOfTheDay
  ) {
    notify("Игра ещё не завершена");
    return;
  }

  const text = makeShareText({
    status: gameStats.latestFinishedGame.status,
    attemptResults: gameSessionStore.attemptResults,
    numberOfTheDay: gameSessionStore?.numberOfTheDay,
  });

  shareText(text);
}

async function shareText(text: string) {
  try {
    const { success } = await shareTextUsingMobileApi(text);
    if (!success) {
      navigator.clipboard.writeText(text);
      notify("Результат скопирован в буфер обмена");
    }
  } catch (e) {
    notify("Произошла ошибка при копировании результата");
    console.error(e);
  }
}

async function shareTextUsingMobileApi(
  text: string
): Promise<{ success: boolean }> {
  const isTouchDevice = "ontouchstart" in document.documentElement;

  const shareData = {
    title: "СЛОВЛО",
    text: text,
  };

  try {
    if (navigator.share && isTouchDevice) {
      await navigator.share(shareData);
      return { success: true };
    }
    return { success: false };
  } catch (e) {
    // cancel share
    return { success: true };
  }
}
