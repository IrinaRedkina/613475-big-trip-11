import EventsModel from './models/events';
import TripRouteController from './controllers/trip-route';
import TripInfoController from './controllers/trip-info';
import FilterController from './controllers/filter';
import MenuComponent from './components/menu';
import {generateEvents} from './mock/event';
import {RenderPosition, render} from './utils/render';

const TRIP_EVENT_COUNT = 5;

const events = generateEvents(TRIP_EVENT_COUNT);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

// Информация о путешествии, Общая стоимость
const siteHeaderContainer = document.querySelector(`.trip-main`);
const tripHeaderController = new TripInfoController(siteHeaderContainer, eventsModel);
tripHeaderController.render();

// меню
const controlsContainer = siteHeaderContainer.querySelector(`.trip-controls`);
const menuTitle = siteHeaderContainer.querySelector(`h2:last-child`);
const menuComponent = new MenuComponent();
render(controlsContainer, menuComponent, RenderPosition.INSERTBEFORE, menuTitle);

// фильтры
const filterController = new FilterController(controlsContainer, eventsModel);
filterController.render();

// список точек маршрута
const tripRouteContainer = document.querySelector(`.trip-events`);
const tripRouteController = new TripRouteController(tripRouteContainer, eventsModel);
tripRouteController.render();

// клик по кнопке New event
const addEventButton = siteHeaderContainer.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, () => {
  tripRouteController.createEvent();
});
