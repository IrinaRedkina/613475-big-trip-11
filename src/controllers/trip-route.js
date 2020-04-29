import SortComponent from '../components/sort';
import {SortType} from '../components/sort';
import DaysComponent from '../components/days';
import DayComponent from '../components/day';
import DayListComponent from '../components/day-list';
import EventComponent from '../components/event';
import EditEventComponent from '../components/event-edit';
import EventsEmptyComponent from '../components/events-empty';
import {Key} from '../utils/common';
import {RenderPosition, render, replace} from '../utils/render';

const renderEvent = (eventsList, event, index) => {
  const eventComponent = new EventComponent(event, index);
  const editEventComponent = new EditEventComponent(event, index);

  editEventComponent.initDateInput();

  const onEscKeyDown = (evt) => {
    if (evt.key === Key.ESC || evt.key === Key.ESC_SHORT) {
      replace(eventComponent, editEventComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setClickEditButtonHandler(() => {
    replace(editEventComponent, eventComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editEventComponent.setClickEditButtonCloseHandler(() => {
    replace(eventComponent, editEventComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editEventComponent.setSubmitEditFormHandler((evt) => {
    evt.preventDefault();
    replace(eventComponent, editEventComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsList, eventComponent, RenderPosition.BEFOREEND);
};

const getPrevDate = (prevEvent) => {
  return prevEvent ? prevEvent.dueDateStart : new Date(0);
};

const renderEventsByDays = (events, container) => {
  let dateCount = 1;
  let eventsList = null;

  events.forEach((event, i, items) => {
    const currentDate = event.dueDateStart;
    const prevDate = getPrevDate(items[i - 1]);

    if (currentDate.toDateString() !== prevDate.toDateString()) {
      const dayComponent = new DayComponent(dateCount, event.dueDateStart);
      const dayListComponent = new DayListComponent(dateCount);

      render(container, dayComponent, RenderPosition.BEFOREEND);
      render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

      eventsList = dayListComponent.getElement();
      dateCount += 1;
    }

    renderEvent(eventsList, event, i);
  });
};

const renderEvents = (events, container) => {
  const dayComponent = new DayComponent();
  const dayListComponent = new DayListComponent();

  render(container, dayComponent, RenderPosition.BEFOREEND);
  render(dayComponent.getElement(), dayListComponent, RenderPosition.BEFOREEND);

  const eventsList = dayListComponent.getElement();

  events.forEach((event, i) => {
    renderEvent(eventsList, event, i);
  });
};

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
      sortedEvents = showingEvents.sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
      break;
  }

  return sortedEvents;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._eventsEmptyComponent = new EventsEmptyComponent();
    this._daysComponent = new DaysComponent();
    this._sortComponent = new SortComponent();
  }

  render(events) {
    const container = this._container;

    if (events.length === 0) {
      render(container, this._eventsEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);

    const eventsByDays = getSortedEvents(events, SortType.DEFAULT);

    renderEventsByDays(eventsByDays, this._daysComponent.getElement());

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);

      this._daysComponent.getElement().innerHTML = ``;

      if (sortType === SortType.DEFAULT) {
        renderEventsByDays(sortedEvents, this._daysComponent.getElement());
      } else {
        renderEvents(sortedEvents, this._daysComponent.getElement());
      }
    });
  }
}
