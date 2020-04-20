export const RenderPosition = {
  AFTERBEGIN: `afterBegin`,
  BEFOREEND: `beforeEnd`,
  INSERTBEFORE: `insertBefore`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place, referenceElement) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.INSERTBEFORE:
      container.insertBefore(element, referenceElement);
      break;
  }
};
