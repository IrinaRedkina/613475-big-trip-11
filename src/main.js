import {createTripInfoTemplate} from './components/trip-info';
import {createCostTemplate} from './components/cost';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createDaysTemplate} from './components/days';
import {createDayTemplate} from './components/day';
import {createEventTemplate} from './components/event';
import {createEditEventTemplate} from './components/event-edit';
import {filters} from './mock/filter';
import {generateEvents} from './mock/event';
import flatpickr from 'flatpickr';

const TRIP_EVENT_COUNT = 5;
const INPUT_DATE_FORMAT = `d/m/y H:i`;

const events = generateEvents(TRIP_EVENT_COUNT);
const totalPrice = events.reduce((acc, event) => acc + event.price, 0);
const eventsByDays = events.slice().sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());

const tripDateStart = eventsByDays[0].dueDateStart;
const tirpDateEnd = eventsByDays[eventsByDays.length - 1].dueDateEnd;
const routePoints = eventsByDays.map((item) => item.city);

const renderElement = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderContainer = document.querySelector(`.trip-main`);
const menuContainer = siteHeaderContainer.querySelector(`.trip-controls`);

renderElement(siteHeaderContainer, createTripInfoTemplate(tripDateStart, tirpDateEnd, routePoints), `afterBegin`);
renderElement(menuContainer.querySelector(`h2:first-child`), createMenuTemplate(), `afterEnd`);
renderElement(menuContainer, createFilterTemplate(filters), `beforeEnd`);

const tripInfoContainer = siteHeaderContainer.querySelector(`.trip-info`);
renderElement(tripInfoContainer, createCostTemplate(totalPrice), `beforeEnd`);

const tripEventsContainer = document.querySelector(`.trip-events`);
renderElement(tripEventsContainer, createSortTemplate(), `beforeEnd`);
renderElement(tripEventsContainer, createDaysTemplate(), `beforeEnd`);


/*
 * render events by days
 */
const tripDayList = document.querySelector(`.trip-days`);
let dateCount = 1;
let eventList = tripDayList.querySelector(`.trip-events__list--day-${dateCount}`);

const getPrevDate = (prevEvent) => {
  return prevEvent ? prevEvent.dueDateStart : new Date(0);
};

eventsByDays.forEach((day, i, items) => {
  const currentDate = day.dueDateStart;
  const prevDate = getPrevDate(items[i - 1]);

  if (currentDate.toDateString() !== prevDate.toDateString()) {
    renderElement(tripDayList, createDayTemplate(dateCount, day.dueDateStart), `beforeEnd`);
    eventList = tripDayList.querySelector(`.trip-events__list--day-${dateCount}`);
    dateCount += 1;
  }

  renderElement(eventList, createEventTemplate(day, i), `beforeEnd`);
});


/*
 * open/close edit events
 */
const initFlatpickr = (selectDateInputs) => {
  selectDateInputs.forEach((item) => {
    flatpickr(item, {
      enableTime: true,
      dateFormat: INPUT_DATE_FORMAT,
      defaultDate: new Date(item.value)
    });
  });
};

const closeAtherEventEdit = () => {
  const eventEdit = tripDayList.querySelector(`.event--edit`);
  if (eventEdit !== null) {
    closeEventEdit(eventEdit.closest(`.trip-events__item`));
  }
};

const openEventEdit = (eventItem) => {
  const eventId = eventItem.getAttribute(`data-id`);

  closeAtherEventEdit();

  eventItem.querySelector(`.event`).remove();
  renderElement(eventItem, createEditEventTemplate(eventsByDays[eventId], eventId, false), `beforeEnd`);

  const selectDateInputs = eventItem.querySelectorAll(`.event__input--time`);
  initFlatpickr(selectDateInputs);

  const coordTop = eventItem.offsetTop + document.querySelector(`.page-header`).clientHeight;
  window.scroll(0, coordTop);
};

const closeEventEdit = (eventItem) => {
  const eventId = eventItem.getAttribute(`data-id`);

  eventItem.querySelector(`.event--edit`).remove();
  renderElement(eventItem, createEventTemplate(eventsByDays[eventId], eventId, false), `beforeEnd`);
};

tripDayList.addEventListener(`click`, (evt) => {
  const targetClass = `event__rollup-btn`;

  if (targetClass !== evt.target.getAttribute(`class`)) {
    return;
  }

  const eventItem = evt.target.closest(`.trip-events__item`);
  const isEventForm = !!evt.target.closest(`.event--edit`);

  if (!isEventForm) {
    openEventEdit(eventItem);
  } else {
    closeEventEdit(eventItem);
  }
});
