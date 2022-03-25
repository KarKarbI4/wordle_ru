import { applyAnimationOnce } from "./lib/applyAnimationOnce";
import { createInstanceOfTemplate } from "./lib/createInstanceOfTemplate";

function createNewModal() {
  const modal = createInstanceOfTemplate("#game-modal");
  if (!modal) {
    throw new Error("Failed to create modal");
  }

  const modalsContainer = document.querySelector("#modals-container");
  if (!modalsContainer) {
    throw new Error("Failed to find modals container");
  }

  modalsContainer.appendChild(modal);
  modal.classList.remove("modal-hidden", "modal-hidden-animate");

  return modal;
}

export async function openModal(content: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const modal = createNewModal();
    const contentContainer = modal.querySelector(".modal-content")!;
    contentContainer.appendChild(content);

    async function closeModal() {
      if (!modal) {
        throw new Error("Failed to close modal");
      }

      await applyAnimationOnce(
        modal,
        "modal-hidden-animate",
        "disappear-animation"
      );
      modal.classList.add("modal-hidden");
      modal.remove();
      resolve();
    }

    const crossElement = modal.querySelector(".modal-close");
    crossElement?.addEventListener("click", () => {
      closeModal();
    });

    modal?.addEventListener("click", () => {
      closeModal();
    });
  });
}
