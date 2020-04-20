import SortComponent from '../components/sort';
import DaysComponent from '../components/days';
import DayComponent from '../components/day';
import EventComponent from '../components/event';
import EditEventComponent from '../components/event-edit';
import EventsEmptyComponent from '../components/events-empty';
import {Key} from '../utils/common';
import {RenderPosition, render, replace} from '../utils/render';

const getPrevDate = (prevEvent) => {
  return prevEvent ? prevEvent.dueDateStart : new Date(0);
};

const renderEvent = (eventsList, event, index) => {
  const eventComponent = new EventComponent(event, index);
  const editEventComponent = new EditEventComponent(event, index);

  editEventComponent.initDateInput();

  const replaceEventToEdit = () => {
    replace(editEventComponent, eventComponent);
  };

  const replaceEditToTask = () => {
    replace(eventComponent, editEventComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === Key.ESC || evt.key === Key.ESC_SHORT) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setClickEditButtonHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editEventComponent.setClickEditButtonCloseHandler(() => {
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editEventComponent.setSubmitEditFormHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsList, eventComponent, RenderPosition.BEFOREEND);
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
    const dayElement = this._daysComponent.getElement();

    if (events.length === 0) {
      render(container, this._eventsEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);

    const eventsByDays = events.slice()
      .sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());

    let dateCount = 1;
    let eventsList = dayElement.querySelector(`.trip-events__list--day-${dateCount}`);

    eventsByDays.forEach((event, i, items) => {
      const currentDate = event.dueDateStart;
      const prevDate = getPrevDate(items[i - 1]);

      if (currentDate.toDateString() !== prevDate.toDateString()) {
        render(dayElement, new DayComponent(dateCount, event.dueDateStart), RenderPosition.BEFOREEND);
        eventsList = dayElement.querySelector(`.trip-events__list--day-${dateCount}`);
        dateCount += 1;
      }

      renderEvent(eventsList, event, i);
    });
  }
}
