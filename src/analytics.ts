export function sendAnalyticsEvent(event: string) {
  // yandex metrika counter method
  // @ts-ignore
  ym(88053813, "reachGoal", event);
}
