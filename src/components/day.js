import {createElement, formatDate} from '../util';

const createDayTemplate = (count, date) => {
  const fullDate = formatDate(date, `Y-m-d`);
  const shortDate = formatDate(date, `M d`);

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${fullDate}">${shortDate}</time>
      </div>

      <ul class="trip-events__list trip-events__list--day-${count}"></ul>
    </li>`
  );
};

export default class DayComponent {
  constructor(count, date) {
    this._count = count;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._count, this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
