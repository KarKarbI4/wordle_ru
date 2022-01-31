import { applyAnimationOnce } from "./ui";

const crossElement = document.querySelector(".modal-close");

crossElement?.addEventListener("click", () => {
  closeModal();
});

const backdropElement = document.querySelector(".modal-backdrop");

backdropElement?.addEventListener("click", () => {
  closeModal();
});

export function showModal() {
  const modal = document.querySelector("#endGameModal");
  modal?.classList.remove("modal-hidden", "modal-hidden-animate");
}

export async function closeModal() {
  const modal = document.querySelector<HTMLElement>("#endGameModal");

  if (!modal) {
    throw new Error("Modal element not found");
  }

  await applyAnimationOnce(
    modal,
    "modal-hidden-animate",
    "disappear-animation"
  );
  modal.classList.add("modal-hidden");
}
