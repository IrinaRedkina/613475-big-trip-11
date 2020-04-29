import AbstractComponent from './abstract-component';

const createDayListTemplate = (count = 0) => {
  return (
    `<ul class="trip-events__list trip-events__list--day-${count}"></ul>`
  );
};

export default class Day extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createDayListTemplate(this._count, this._date);
  }
}
