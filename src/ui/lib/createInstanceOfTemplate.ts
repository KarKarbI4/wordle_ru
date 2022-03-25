export function createInstanceOfTemplate(
  templateId: string
): HTMLElement | undefined {
  const template = document.querySelector<HTMLTemplateElement>(templateId);

  return template?.content.firstElementChild?.cloneNode(true) as
    | HTMLElement
    | undefined;
}
