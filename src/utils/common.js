export const Key = {
  ENTER: `Enter`,
  ESC: `Escape`,
  ESC_SHORT: `Esc`,
  MOUSE_LEFT: 0
};

export const toUpperCaseFirstLetter = (string) => {
  return `${string[0].toUpperCase() + string.substring(1)}`;
};

export const getRandomElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomLengthArray = (array) => {
  return array.filter(() => Math.random() > 0.5);
};

export const isInteger = (num) => {
  return (num ^ 0) === num;
};
