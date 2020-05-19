import {formatTime, formatDate, getTimeInterval} from '../utils/date';
import {toUpperCaseFirstLetter, getTypeGroup} from '../utils/common';
import {placeholderGroup} from '../const';
import AbstractComponent from './abstract-component';

const MAX_LENGTH_TITLE = 15;
const MAX_COUNT_OPTIONS = 3;

const createOfferMarkup = (option) => {
  const {title, price} = option;
  const shortTitle = title.length > MAX_LENGTH_TITLE ? title.substr(0, MAX_LENGTH_TITLE) : title;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${shortTitle}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const createEventTemplate = (event) => {
  const {type, destination, price, options, dueDateStart, dueDateEnd} = event;

  const placeholder = placeholderGroup[getTypeGroup(type)];
  const title = `${toUpperCaseFirstLetter(type)} ${placeholder} ${destination[`name`]}`;

  const dateStart = formatDate(dueDateStart);
  const dateEnd = formatDate(dueDateEnd);
  const timeStart = formatTime(dueDateStart);
  const timeEnd = formatTime(dueDateEnd);
  const duration = getTimeInterval(dueDateStart, dueDateEnd);

  const isShowingOptions = options.length;

  const offersMarkup = options ? options
    .map((option) => createOfferMarkup(option))
    .slice(0, MAX_COUNT_OPTIONS)
    .join(`\n`) : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateStart}T${timeStart}">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateEnd}T${timeEnd}">${timeEnd}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        ${isShowingOptions ? `
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>
        ` : ``}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setClickEditHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      handler();
    });
  }
}
