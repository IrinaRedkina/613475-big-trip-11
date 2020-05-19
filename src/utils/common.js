import {typesByGroup} from '../const';

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
  return typesByGroup[`transfer`].includes(type) ? `transfer` : `activity`;
};
