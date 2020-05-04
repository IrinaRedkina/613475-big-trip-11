import AbstractComponent from './abstract-component';
import {formatDate} from '../utils/date';

const createDayTemplate = (count = ``, date = ``) => {
  let fullDate = ``;
  let shortDate = ``;

  if (date instanceof Date) {
    fullDate = formatDate(date, `Y-MM-DD`);
    shortDate = formatDate(date, `MMM DD`);
  }

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${fullDate}">${shortDate}</time>
      </div>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(count, date) {
    super();

    this._count = count;
    this._date = date;
  }

  getTemplate() {
    return createDayTemplate(this._count, this._date);
  }
}
