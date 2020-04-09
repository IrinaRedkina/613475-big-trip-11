import {createTripInfoTemplate} from './components/trip-info';
import {createCostTemplate} from './components/cost';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createEventsTemplate} from './components/events';
import {createEventTemplate} from './components/event';
import {createEditEventTemplate} from './components/edit-event';

const TRIP_EVENT_COUNT = 3;

const renderElement = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainContainer = document.querySelector(`.trip-main`);
const menuContainer = tripMainContainer.querySelector(`.trip-controls`);
const menuTitle = tripMainContainer.querySelector(`h2:first-child`);

renderElement(tripMainContainer, createTripInfoTemplate(), `afterBegin`);

const tripInfoContainer = tripMainContainer.querySelector(`.trip-info`);
renderElement(tripInfoContainer, createCostTemplate(), `beforeEnd`);

renderElement(menuTitle, createMenuTemplate(), `afterEnd`);
renderElement(menuContainer, createFilterTemplate(), `beforeEnd`);

const tripEventsContainer = document.querySelector(`.trip-events`);
renderElement(tripEventsContainer, createEventsTemplate(), `beforeEnd`);

const tripEventsList = tripEventsContainer.querySelector(`.trip-events__list`);
renderElement(tripEventsList, createEditEventTemplate(), `beforeEnd`);

for (let i = 0; i < TRIP_EVENT_COUNT; i++) {
  renderElement(tripEventsList, createEventTemplate(), `beforeEnd`);
}
