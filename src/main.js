import TripInfoComponent from './components/trip-info';
import CostComponent from './components/cost';
import MenuComponent from './components/menu';
import FilterComponent from './components/filter';
import SortComponent from './components/sort';
import DaysComponent from './components/days';
import DayComponent from './components/day';
import EventComponent from './components/event';
import EditEventComponent from './components/event-edit';
import {filters} from './mock/filter';
import {generateEvents} from './mock/event';
import {render, RenderPosition} from './util';
import flatpickr from 'flatpickr';

const TRIP_EVENT_COUNT = 5;
const INPUT_DATE_FORMAT = `d/m/y H:i`;

const events = generateEvents(TRIP_EVENT_COUNT);
const totalPrice = events.reduce((acc, event) => acc + event.price, 0);
const eventsByDays = events.slice().sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());

const tripDateStart = eventsByDays[0].dueDateStart;
const tirpDateEnd = eventsByDays[eventsByDays.length - 1].dueDateEnd;
const routePoints = eventsByDays.map((item) => item.city);

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

const renderTripHeader = () => {
  const siteHeaderContainer = document.querySelector(`.trip-main`);
  const menuContainer = siteHeaderContainer.querySelector(`.trip-controls`);
  const menuTitle = menuContainer.querySelector(`h2:last-child`);
  const tripInfoComponent = new TripInfoComponent(tripDateStart, tirpDateEnd, routePoints);

  render(siteHeaderContainer, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
  render(menuContainer, new MenuComponent().getElement(), RenderPosition.INSERTBEFORE, menuTitle);
  render(menuContainer, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);
  render(tripInfoComponent.getElement(), new CostComponent(totalPrice).getElement(), RenderPosition.BEFOREEND);
};

const renderTripRoute = () => {
  const tripEventsContainer = document.querySelector(`.trip-events`);
  const daysComponenet = new DaysComponent();

  render(tripEventsContainer, new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(tripEventsContainer, daysComponenet.getElement(), RenderPosition.BEFOREEND);

  let dateCount = 1;
  let eventsList = daysComponenet.getElement().querySelector(`.trip-events__list--day-${dateCount}`);

  eventsByDays.forEach((event, i, items) => {
    const currentDate = event.dueDateStart;
    const prevDate = getPrevDate(items[i - 1]);

    if (currentDate.toDateString() !== prevDate.toDateString()) {
      render(daysComponenet.getElement(), new DayComponent(dateCount, event.dueDateStart).getElement(), RenderPosition.BEFOREEND);
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
    eventsList.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditToTask = () => {
    eventsList.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };

  editEventOpen.addEventListener(`click`, () => {
    replaceEventToEdit();
  });

  editEventClose.addEventListener(`click`, () => {
    replaceEditToTask();
  });

  eventForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
  });

  render(eventsList, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

renderTripHeader();
renderTripRoute();
