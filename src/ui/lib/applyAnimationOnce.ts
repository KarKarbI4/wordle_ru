export function applyAnimationOnce(
  element: HTMLElement,
  className: string,
  animationName: string = className.split("-").pop()!
) {
  return new Promise<void>((resolve) => {
    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === animationName) {
        element.classList.remove(className);
        element.removeEventListener("animationend", handleAnimationEnd);
        resolve();
      }
    };

    element.classList.add(className);
    element.addEventListener("animationend", handleAnimationEnd);
  });
}
