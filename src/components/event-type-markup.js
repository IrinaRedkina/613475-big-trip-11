import {toUpperCaseFirstLetter} from '../utils/common';
import {placeholderGroup, typesByGroup} from '../const';

const createTypeMarkup = (typeName, isSelected, group) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${typeName}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        data-placeholder="${placeholderGroup[group]}"
        value="${typeName}"
        ${isSelected ? `checked` : ``}
      >
      <label class="event__type-label  event__type-label--${typeName}" for="event-type-${typeName}">${toUpperCaseFirstLetter(typeName)}</label>
    </div>`
  );
};

const createGroupMarkup = (group, selectedType) => {
  const typeListMarpkup = typesByGroup[group]
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
  const groups = Object.keys(typesByGroup);
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
