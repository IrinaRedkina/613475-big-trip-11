import {formatDate} from '../util';

export const createDayTemplate = (count, date) => {
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
