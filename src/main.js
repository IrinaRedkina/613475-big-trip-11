import InfoComponent from './components/info';
import TripInfoComponent from './components/trip-info';
import CostComponent from './components/cost';
import MenuComponent from './components/menu';
import FilterComponent from './components/filter';
import SortComponent from './components/sort';
import DaysComponent from './components/days';
import DayComponent from './components/day';
import EventComponent from './components/event';
import EditEventComponent from './components/event-edit';
import EventsEmptyComponent from './components/events-empty';
import {filters} from './mock/filter';
import {generateEvents} from './mock/event';
import {Key} from './utils/common';
import {RenderPosition, render, replace} from './utils/render';

import flatpickr from 'flatpickr';

const TRIP_EVENT_COUNT = 5;
const INPUT_DATE_FORMAT = `d/m/y H:i`;
const events = generateEvents(TRIP_EVENT_COUNT);

const getPrevDate = (prevEvent) => {
  return prevEvent ? prevEvent.dueDateStart : new Date(0);
};

const initFlatpickr = (dateFields) => {
  dateFields.forEach((field) => {
    flatpickr(field, {
      enableTime: true,
      dateFormat: INPUT_DATE_FORMAT,
      defaultDate: new Date(field.value)
    });
  });
};

const renderTripHeader = (tirpEvents) => {
  const siteHeaderContainer = document.querySelector(`.trip-main`);
  const menuContainer = siteHeaderContainer.querySelector(`.trip-controls`);
  const menuTitle = menuContainer.querySelector(`h2:last-child`);

  const totalPrice = tirpEvents ? tirpEvents.reduce((acc, event) => acc + event.price, 0) : 0;

  const infoComponent = new InfoComponent();
  const costComponent = new CostComponent(totalPrice);
  const menuComponent = new MenuComponent();
  const filterComponent = new FilterComponent(filters);

  render(siteHeaderContainer, infoComponent, RenderPosition.AFTERBEGIN);
  render(infoComponent.getElement(), costComponent, RenderPosition.BEFOREEND);
  render(menuContainer, menuComponent, RenderPosition.INSERTBEFORE, menuTitle);
  render(menuContainer, filterComponent, RenderPosition.BEFOREEND);

  if (tirpEvents.length > 0) {
    const eventsByDays = tirpEvents.slice().sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
    const tripDateStart = eventsByDays[0].dueDateStart;
    const tirpDateEnd = eventsByDays[eventsByDays.length - 1].dueDateEnd;
    const routePoints = eventsByDays.map((item) => item.city);

    const tripInfoComponent = new TripInfoComponent(tripDateStart, tirpDateEnd, routePoints);
    render(infoComponent.getElement(), tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
};

const renderTripRoute = (tirpEvents) => {
  const tripEventsContainer = document.querySelector(`.trip-events`);

  if (tirpEvents.length === 0) {
    render(tripEventsContainer, new EventsEmptyComponent(), RenderPosition.BEFOREEND);
    return;
  }

  const eventsByDays = tirpEvents.slice().sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
  const daysComponenet = new DaysComponent();

  render(tripEventsContainer, new SortComponent(), RenderPosition.BEFOREEND);
  render(tripEventsContainer, daysComponenet, RenderPosition.BEFOREEND);

  let dateCount = 1;
  let eventsList = daysComponenet.getElement().querySelector(`.trip-events__list--day-${dateCount}`);

  eventsByDays.forEach((event, i, items) => {
    const currentDate = event.dueDateStart;
    const prevDate = getPrevDate(items[i - 1]);

    if (currentDate.toDateString() !== prevDate.toDateString()) {
      render(daysComponenet.getElement(), new DayComponent(dateCount, event.dueDateStart), RenderPosition.BEFOREEND);
      eventsList = daysComponenet.getElement().querySelector(`.trip-events__list--day-${dateCount}`);
      dateCount += 1;
    }

    renderEvent(eventsList, event, i);
  });
};

const renderEvent = (eventsList, event, index) => {
  const eventComponent = new EventComponent(event, index);
  const editEventComponent = new EditEventComponent(event, index);

  const editEventOpen = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  const editEventClose = editEventComponent.getElement().querySelector(`.event__rollup-btn`);

  const eventForm = editEventComponent.getElement().querySelector(`form`);
  const dateFields = editEventComponent.getElement().querySelectorAll(`.event__input--time`);

  initFlatpickr(dateFields);

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

  editEventOpen.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editEventClose.addEventListener(`click`, () => {
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsList, eventComponent, RenderPosition.BEFOREEND);
};

renderTripHeader(events);
renderTripRoute(events);
