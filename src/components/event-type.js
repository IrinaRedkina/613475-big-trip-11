import {types, typeList} from '../mock/event';
import {toUpperCaseFirstLetter} from "../util";

const createTypeMarkup = (typeName, isSelected, idEvent) => {
  return (
    `<div class="event__type-item">
      <input
        id="event-type-${typeName}-${idEvent}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${typeName}"
        ${isSelected ? `checked` : ``}
      >
      <label class="event__type-label  event__type-label--${typeName}" for="event-type-${typeName}-${idEvent}">${toUpperCaseFirstLetter(typeName)}</label>
    </div>`
  );
};

const createGroupMarkup = (group, selectedType, idEvent) => {
  const typeListMarpkup = typeList
    .filter((type) => types[type][`group`] === group)
    .map((type) => createTypeMarkup(type, type === selectedType, idEvent))
    .join(`\n`);

  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${toUpperCaseFirstLetter(group)}</legend>
      ${typeListMarpkup}
    </fieldset>`
  );
};

const createTypeListMarkup = (selectedType, idEvent) => {
  const groups = new Set(typeList.map((type) => types[type][`group`]));
  let groupsMarkup = ``;

  groups.forEach((group) => {
    groupsMarkup += `${createGroupMarkup(group, selectedType, idEvent)}`;
  });

  return (
    `<div class="event__type-list">
      ${groupsMarkup}
    </div>`
  );
};

export {createTypeListMarkup};
