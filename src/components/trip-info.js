import {formatDate, createElement} from '../util';

const getShortRoute = (cities) => {
  return [
    cities[0],
    `...`,
    cities[cities.length - 1]
  ];
};

const createTripInfoTemplate = (tripDateStart, tripDateEnd, routePoints) => {
  const isOneMonth = tripDateStart.getMonth() === tripDateEnd.getMonth();
  const isOneDate = tripDateStart.getDate() === tripDateEnd.getDate();

  const delimiter = `&nbsp;&mdash;&nbsp;`;
  const formattingDateEnd = isOneMonth ? `d` : `M d`;

  const dateStart = formatDate(tripDateStart, `M d`);
  const dateEnd = isOneDate ? `` : `${delimiter} ${formatDate(tripDateEnd, formattingDateEnd)}`;

  const cities = routePoints.filter((city, i, items) => city !== items[i - 1]);
  const tripCities = cities.length > 3 ? getShortRoute(cities) : cities;

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripCities.join(` &mdash; `)}</h1>
        <p class="trip-info__dates">${dateStart} ${dateEnd}</p>
      </div>
    </section>`
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
