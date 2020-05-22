import {typesByGroup, TypeGroup} from '../const';

export const Key = {
  ENTER: `Enter`,
  ESC: `Escape`,
  ESC_SHORT: `Esc`,
  MOUSE_LEFT: 0
};

export const toUpperCaseFirstLetter = (string) => {
  return `${string[0].toUpperCase() + string.substring(1)}`;
};

export const getTypeGroup = (type) => {
  return typesByGroup[TypeGroup.TRANSFER].includes(type) ? TypeGroup.TRANSFER : TypeGroup.ACTIVITI;
};

export const sortEventsByDays = (events) => {
  return events.sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
};

export const getFirstElement = (array) => {
  return array[0];
};

export const getLastElement = (array) => {
  return array[array.length - 1];
};
