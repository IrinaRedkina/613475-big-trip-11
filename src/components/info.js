import AbstractComponent from './abstract-component';

const createInfoTemplate = () => {
  return (
    `<section class="trip-main__trip-info trip-info"></section>`
  );
};

export default class Info extends AbstractComponent {
  getTemplate() {
    return createInfoTemplate();
  }
}
