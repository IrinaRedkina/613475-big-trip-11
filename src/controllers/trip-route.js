import SortComponent, {SortType} from '../components/sort';
import DaysComponent from '../components/days';
import DayComponent from '../components/day';
import DayListComponent from '../components/day-list';
import EventsEmptyComponent from '../components/events-empty';
import EventController from './event';
import {Mode as EventControllerMode, emptyEvent} from './event';
import {RenderPosition, render, replace, remove} from '../utils/render';
import {addEventButton} from '../const';
import {sortEventsByDays} from '../utils/common';

const getSortedEvents = (events, sortType) => {
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
      sortedEvents = sortEventsByDays(showingEvents);
      break;
  }

  return sortedEvents;
};

const getPrevDate = (prevEvent) => {
  return prevEvent ? prevEvent.dueDateStart : new Date(0);
};

export default class TripController {
  constructor(container, eventsModel, offerModel, destinationsModel, api) {
    this._container = container;
    this._api = api;

    this._eventsModel = eventsModel;
    this._offersModel = offerModel;
    this._destinationsModel = destinationsModel;

    this._eventControllers = [];
    this._creatingEvent = null;

    this._activeSortType = SortType.DEFAULT;

    this._eventsEmptyComponent = new EventsEmptyComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();

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
    const allEvents = this._eventsModel.getEventsAll();

    if (allEvents.length === 0) {
      render(container, this._eventsEmptyComponent, RenderPosition.BEFOREEND);

      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);

    this._renderEvents();
  }

  _renderEvents() {
    const events = this._eventsModel.getEvents();
    const sortedEvents = getSortedEvents(events, this._activeSortType);

    if (this._activeSortType === SortType.DEFAULT) {
      this._eventControllers = this._renderEventsByDays(sortedEvents);
    } else {
      this._eventControllers = this._renderSortedEvents(sortedEvents);
    }
  }

  _renderEventsByDays(events) {
    let dayCount = 1;
    let eventsList = null;

    return events.map((event, i, items) => {
      const currentDate = event.dueDateStart;
      const prevDate = getPrevDate(items[i - 1]);

      if (currentDate.toDateString() !== prevDate.toDateString()) {
        const dayComponent = new DayComponent(dayCount, event.dueDateStart);
        const dayListComponent = new DayListComponent(dayCount);

        render(this._daysList, dayComponent, RenderPosition.BEFOREEND);
        render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

        eventsList = dayListComponent.getElement();
        dayCount += 1;
      }

      return this._renderEvent(eventsList, event);
    });
  }

  _renderSortedEvents(events) {
    const dayComponent = new DayComponent();
    const dayListComponent = new DayListComponent();
    const eventsList = dayListComponent.getElement();

    render(this._daysList, dayComponent, RenderPosition.BEFOREEND);
    render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

    return events.map((event) => {
      return this._renderEvent(eventsList, event);
    });
  }

  _renderEvent(eventsList, event) {
    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();
    const eventController = new EventController(eventsList, this._onDataChange, this._onViewChange);

    eventController.render(event, offers, destinations);

    return eventController;
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();

    if (this._eventsModel.getEventsAll().length === 0) {
      remove(this._eventsEmptyComponent);
      render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
      render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
    }

    this._updateEvents();

    this._creatingEvent = new EventController(this._daysList, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(emptyEvent, offers, destinations, EventControllerMode.ADDING);
  }

  _addNewEvent(eventController, newData) {
    this._api.createEvent(newData)
      .then((eventModel) => {
        this._eventsModel.addEvent(eventModel);
        this._updateEvents();
      })
      .catch(() => {
        eventController.shake();
      });
  }

  _updateEvent(eventController, oldData, newData, isFavoriteChange) {
    this._api.updateEvent(oldData.id, newData)
      .then((eventModel) => {
        const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);

        if (isSuccess && isFavoriteChange) {
          eventController.setFavorite(eventModel.isFavorite);
        }

        if (isSuccess && !isFavoriteChange) {
          this._updateEvents();
        }
      })
      .catch(() => {
        eventController.shake();
      });
  }

  _removeEvent(eventController, id) {
    this._api.deleteEvent(id)
      .then(() => {
        this._eventsModel.removeEvent(id);

        if (this._eventsModel.getEventsAll().length === 0) {
          remove(this._sortComponent);
          render(this._container, this._eventsEmptyComponent, RenderPosition.BEFOREEND);
        }

        this._updateEvents();
      })
      .catch(() => {
        eventController.shake();
      });
  }

  _destroyCreatingEvent() {
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      addEventButton.removeAttribute(`disabled`);
      this._creatingEvent = null;
    }
  }

  _updateEvents() {
    this._removeEvents();

    this._daysList.innerHTML = ``;

    this._destroyCreatingEvent();

    this._renderEvents();
  }

  _resetSort() {
    this._activeSortType = SortType.DEFAULT;

    const oldSortComponent = this._sortComponent;
    this._sortComponent = new SortComponent();

    replace(this._sortComponent, oldSortComponent);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _removeEvents() {
    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _onDataChange(eventController, oldData, newData, isFavoriteChange = false) {
    if (oldData === emptyEvent) {
      this._creatingEvent = null;

      if (newData === null) {
        eventController.destroy();
        addEventButton.removeAttribute(`disabled`);
      } else {
        this._addNewEvent(eventController, newData);
        addEventButton.removeAttribute(`disabled`);
      }
    } else if (newData === null) {
      this._removeEvent(eventController, oldData.id);
    } else {
      this._updateEvent(eventController, oldData, newData, isFavoriteChange);
    }
  }

  _onFilterChange() {
    this._resetSort();
    this._updateEvents();
  }

  _onSortTypeChange(sortType) {
    this._activeSortType = sortType;

    this._updateEvents();
  }

  _onViewChange() {
    this._eventControllers.forEach((it) => it.setDefaultView());

    this._destroyCreatingEvent();
  }

  hide() {
    this._onViewChange();
    this._sortComponent.hide();
    this._daysComponent.hide();
  }

  show() {
    this._sortComponent.show();
    this._daysComponent.show();
  }
}
