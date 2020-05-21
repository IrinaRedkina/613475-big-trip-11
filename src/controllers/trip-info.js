import TripInfoComponent from '../components/trip-info';
import {RenderPosition, render, replace} from '../utils/render';
import {sortEventsByDays, getFirstElement, getLastElement} from '../utils/common';

const getOptionsTotalSum = (options) => {
  return options.reduce((acc, option) => acc + option.price, 0);
};

const getTotalPrice = (events) => {
  return events.reduce((acc, event) => acc + event.price + getOptionsTotalSum(event.options), 0);
};

export default class TripInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  _onDataChange() {
    this.render();
  }

  render() {
    const container = this._container;
    const events = this._eventsModel.getEvents();
    const eventsByDays = sortEventsByDays(events.slice());

    const totalPrice = getTotalPrice(events);
    const tripDateStart = events.length ? getFirstElement(eventsByDays).dueDateStart : null;
    const tirpDateEnd = events.length ? getLastElement(eventsByDays).dueDateEnd : null;
    const routePoints = eventsByDays.map((item) => item.destination.name);

    const oldTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoComponent(totalPrice, tripDateStart, tirpDateEnd, routePoints);

    if (oldTripInfoComponent) {
      replace(this._tripInfoComponent, oldTripInfoComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }
}
