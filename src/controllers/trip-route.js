import SortComponent from '../components/sort';
import {SortType} from '../components/sort';
import DaysComponent from '../components/days';
import DayComponent from '../components/day';
import DayListComponent from '../components/day-list';
import EventsEmptyComponent from '../components/events-empty';
import {RenderPosition, render} from '../utils/render';
import PointController from './point';

const getPrevDate = (prevEvent) => {
  return prevEvent ? prevEvent.dueDateStart : new Date(0);
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._eventControllers = [];

    this._eventsEmptyComponent = new EventsEmptyComponent();
    this._daysComponent = new DaysComponent();
    this._sortComponent = new SortComponent();

    this._daysList = this._daysComponent.getElement();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this. _onSortTypeChange);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(events) {
    const container = this._container;
    this._events = events;

    if (this._events.length === 0) {
      render(container, this._eventsEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);

    const eventsByDays = this._getSortedEvents(this._events, SortType.DEFAULT);
    const eventControllers = this._renderEventsByDays(eventsByDays, this._daysList);

    this._eventControllers = eventControllers;
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = this._getSortedEvents(this._events, sortType);

    this._daysList.innerHTML = ``;

    const eventControllers = (sortType === SortType.DEFAULT)
      ? this._renderEventsByDays(sortedEvents, this._daysList)
      : this._renderEvents(sortedEvents, this._daysList);

    this._eventControllers = eventControllers;
  }

  _renderEventsByDays(events, daysList) {
    let dateCount = 1;
    let eventsList = null;

    return events.map((event, i, items) => {
      const currentDate = event.dueDateStart;
      const prevDate = getPrevDate(items[i - 1]);

      if (currentDate.toDateString() !== prevDate.toDateString()) {
        const dayComponent = new DayComponent(dateCount, event.dueDateStart);
        const dayListComponent = new DayListComponent(dateCount);

        render(daysList, dayComponent, RenderPosition.BEFOREEND);
        render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

        eventsList = dayListComponent.getElement();
        dateCount += 1;
      }

      return this._renderEvent(eventsList, event);
    });
  }

  _renderEvents(events, daysList) {
    const dayComponent = new DayComponent();
    const dayListComponent = new DayListComponent();

    render(daysList, dayComponent, RenderPosition.BEFOREEND);
    render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

    const eventsList = dayListComponent.getElement();

    return events.map((event) => {
      return this._renderEvent(eventsList, event);
    });
  }

  _renderEvent(eventsList, event) {
    const pointController = new PointController(eventsList, this._onDataChange, this._onViewChange);
    pointController.render(event);

    return pointController;
  }

  _getSortedEvents(events, sortType) {
    let sortedEvents = [];
    const showingEvents = events.slice();

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = showingEvents.sort((a, b) => (a.dueDateStart - a.dueDateEnd) - (b.dueDateStart - b.dueDateEnd));
        break;
      case SortType.PRICE:
        sortedEvents = showingEvents.sort((a, b) => b.price - a.price);
        break;
      case SortType.DEFAULT:
        sortedEvents = showingEvents.sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
        break;
    }

    return sortedEvents;
  }

  _onDataChange(eventController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    eventController.render(this._events[index]);
  }

  _onViewChange() {
    this._eventControllers.forEach((it) => it.setDefaultView());
  }
}
