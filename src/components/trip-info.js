import AbstractComponent from './abstract-component';
import {formatDate} from '../utils/date';
import {getFirstElement, getLastElement} from '../utils/common';

const MAX_CITIES_COUNT = 3;
const CITIES_SEPARATION = `&mdash; ... &mdash;`;
const DASH_SEPARATION = ` &mdash; `;
const DATES_SEPARATION = `&nbsp;&mdash;&nbsp;`;
const FORMAT_DATE_WITH_MONTH = `MMM DD`;
const FORMAT_DATE_ONE_DATE = `DD`;

const getCitiesString = (cities) => {
  return `${getFirstElement(cities)} ${CITIES_SEPARATION} ${getLastElement(cities)}`;
};

const getDateString = (dateStart, dateEnd) => {
  const isOneMonth = dateStart.getMonth() === dateEnd.getMonth();
  const isOneDate = dateStart.getDate() === dateEnd.getDate();

  const separation = isOneDate ? `` : DATES_SEPARATION;
  const formatDateEnd = isOneMonth ? FORMAT_DATE_ONE_DATE : FORMAT_DATE_WITH_MONTH;

  const formattedDateStart = formatDate(dateStart, FORMAT_DATE_WITH_MONTH);
  const formattedDateEnd = formatDate(dateEnd, formatDateEnd);

  return `${formattedDateStart} ${separation} ${isOneDate ? `` : formattedDateEnd}`;
};

const createTripInfoTemplate = (totalPrice, tripDateStart, tripDateEnd, points) => {
  const sum = totalPrice ? totalPrice : 0;
  const dateString = tripDateStart && tripDateEnd ? getDateString(tripDateStart, tripDateEnd) : ``;
  const cities = points.filter((city, i, items) => city !== items[i - 1]);
  const tripCities = cities.length > MAX_CITIES_COUNT ? getCitiesString(cities) : cities.join(DASH_SEPARATION);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripCities}</h1>

        <p class="trip-info__dates">${dateString}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(tripInfo) {
    super();

    this._totalPrice = tripInfo.totalPrice;
    this._dateStart = tripInfo.dateStart;
    this._dateEnd = tripInfo.dateEnd;
    this._points = tripInfo.points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._totalPrice, this._dateStart, this._dateEnd, this._points);
  }
}
