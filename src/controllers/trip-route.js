import SortComponent from '../components/sort';
import {SortType} from '../components/sort';
import DaysComponent from '../components/days';
import DayComponent from '../components/day';
import DayListComponent from '../components/day-list';
import EventsEmptyComponent from '../components/events-empty';
import {RenderPosition, render, replace} from '../utils/render';
import {Mode as EventControllerMode, emptyEvent} from './event';
import EventController from './event';

const getPrevDate = (prevEvent) => {
  return prevEvent ? prevEvent.dueDateStart : new Date(0);
};

const renderEventsByDays = (events, daysList, onDataChange, onViewChange) => {
  let dayCount = 1;
  let eventsList = null;

  return events.map((event, i, items) => {
    const currentDate = event.dueDateStart;
    const prevDate = getPrevDate(items[i - 1]);

    if (currentDate.toDateString() !== prevDate.toDateString()) {
      const dayComponent = new DayComponent(dayCount, event.dueDateStart);
      const dayListComponent = new DayListComponent(dayCount);

      render(daysList, dayComponent, RenderPosition.BEFOREEND);
      render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

      eventsList = dayListComponent.getElement();
      dayCount += 1;
    }

    const eventController = new EventController(eventsList, onDataChange, onViewChange);
    eventController.render(event, EventControllerMode.DEFAULT);

    return eventController;
  });
};

const renderEventsSorted = (events, daysList, onDataChange, onViewChange) => {
  const dayComponent = new DayComponent();
  const dayListComponent = new DayListComponent();
  const eventsList = dayListComponent.getElement();

  render(daysList, dayComponent, RenderPosition.BEFOREEND);
  render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

  return events.map((event) => {
    const eventController = new EventController(eventsList, onDataChange, onViewChange);
    eventController.render(event, EventControllerMode.DEFAULT);

    return eventController;
  });
};

const renderEvents = (events, daysList, isBreakByDay, onDataChange, onViewChange) => {
  let eventControllers = [];

  if (isBreakByDay) {
    eventControllers = renderEventsByDays(events, daysList, onDataChange, onViewChange);
  } else {
    eventControllers = renderEventsSorted(events, daysList, onDataChange, onViewChange);
  }

  return eventControllers;
};

export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._eventControllers = [];

    this._activeSortType = SortType.DEFAULT;
    this._eventsEmptyComponent = new EventsEmptyComponent();
    this._daysComponent = new DaysComponent();
    this._sortComponent = new SortComponent();
    this._creatingEvent = null;

    this._daysList = this._daysComponent.getElement();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container;
    const events = this._eventsModel.getEvents();

    if (events.length === 0) {
      render(container, this._eventsEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);

    this._renderEvents(events);
  }

  hide() {
    this._updateEvents();
    this._sortComponent.hide();
    this._daysComponent.hide();
  }

  show() {
    this._sortComponent.show();
    this._daysComponent.show();
  }

  _onSortTypeChange(sortType) {
    this._activeSortType = sortType;
    const events = this._eventsModel.getEvents();

    this._daysList.innerHTML = ``;

    this._renderEvents(events);
  }

  _renderEvents(events) {
    const sortedEvents = this._getSortedEvents(events, this._activeSortType);
    const isBreakByDay = this._activeSortType === SortType.DEFAULT;

    this._eventControllers = renderEvents(sortedEvents, this._daysList, isBreakByDay, this._onDataChange, this._onViewChange);
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
    if (oldData === emptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        eventController.destroy();
        this._updateEvents();
      } else {
        this._addNewEvent(newData);
      }
    } else if (newData === null) {
      this._removeEvent(oldData.id);
    } else {
      this._updateEvent(oldData, newData);
    }
  }

  _removeEvent(id) {
    this._eventsModel.removeEvent(id);
    this._updateEvents();
  }

  _addNewEvent(newData) {
    this._eventsModel.addEvent(newData);
    this._updateEvents();
  }

  _updateEvent(oldData, newData) {
    const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

    if (isSuccess) {
      this._updateEvents();
    }
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    this._updateEvents();
    this._eventsModel.resetFilter();

    this._creatingEvent = new EventController(this._container, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(emptyEvent, EventControllerMode.ADDING, this._daysList);
  }

  _onFilterChange() {
    this._updateEvents();
  }

  _updateEvents() {
    this._removeEvents();
    this._daysList.innerHTML = ``;

    if (this._activeSortType !== SortType.DEFAULT) {
      this._resetSort();
    }

    this._renderEvents(this._eventsModel.getEvents());
  }

  _removeEvents() {
    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _resetSort() {
    this._activeSortType = SortType.DEFAULT;
    const oldSortComponent = this._sortComponent;
    this._sortComponent = new SortComponent();
    replace(this._sortComponent, oldSortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _onViewChange() {
    this._eventControllers.forEach((it) => it.setDefaultView());
  }
}
