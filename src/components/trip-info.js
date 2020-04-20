import {formatDate, createElement} from '../util';

const MAX_CITIES_IN_TITLE_COUNT = 3;
const CITIES_SEPARATION = `...`;

const getCitiesString = (cities) => {
  const separation = `&mdash; ${CITIES_SEPARATION} &mdash;`;
  const firstElement = cities[0];
  const lastElement = cities[cities.length - 1];

  return `${firstElement} ${separation} ${lastElement}`;
};

const createTripInfoTemplate = (tripDateStart, tripDateEnd, routePoints) => {
  const isOneMonth = tripDateStart.getMonth() === tripDateEnd.getMonth();
  const isOneDate = tripDateStart.getDate() === tripDateEnd.getDate();

  const delimiter = `&nbsp;&mdash;&nbsp;`;
  const formattingDateEnd = isOneMonth ? `d` : `M d`;

  const dateStart = formatDate(tripDateStart, `M d`);
  const dateEnd = isOneDate ? `` : `${delimiter} ${formatDate(tripDateEnd, formattingDateEnd)}`;

  const cities = routePoints.filter((city, i, items) => city !== items[i - 1]);
  const tripCities = cities.length > MAX_CITIES_IN_TITLE_COUNT ? getCitiesString(cities) : cities.join(` &mdash; `);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${tripCities}</h1>
      <p class="trip-info__dates">${dateStart} ${dateEnd}</p>
    </div>`
  );
};

export default class TripInfoComponent {
  constructor(dateStart, dateEnd, routePoints) {
    this._dateStart = dateStart;
    this._dateEnd = dateEnd;
    this._routePoints = routePoints;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._dateStart, this._dateEnd, this._routePoints);
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
