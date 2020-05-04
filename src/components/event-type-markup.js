import {types, typeList, TypePlaceholder} from '../mock/event';
import {toUpperCaseFirstLetter} from "../utils/common";

const createTypeMarkup = (typeName, isSelected, group) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${typeName}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        data-placeholder="${TypePlaceholder[group]}"
        value="${typeName}"
        ${isSelected ? `checked` : ``}
      >
      <label class="event__type-label  event__type-label--${typeName}" for="event-type-${typeName}">${toUpperCaseFirstLetter(typeName)}</label>
    </div>`
  );
};

const createGroupMarkup = (group, selectedType) => {
  const typeListMarpkup = typeList
    .filter((type) => types[type][`group`] === group)
    .map((type) => createTypeMarkup(type, type === selectedType, group))
    .join(`\n`);

  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${toUpperCaseFirstLetter(group)}</legend>
      ${typeListMarpkup}
    </fieldset>`
  );
};

export const createTypeListMarkup = (selectedType) => {
  const groups = new Set(typeList.map((type) => types[type][`group`]));
  let groupsMarkup = ``;

  groups.forEach((group) => {
    groupsMarkup += `${createGroupMarkup(group, selectedType)}`;
  });

  return (
    `<div class="event__type-list">
      ${groupsMarkup}
    </div>`
  );
};
