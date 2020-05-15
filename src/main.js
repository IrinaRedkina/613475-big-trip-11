import EventsModel from './models/events';
import TripRouteController from './controllers/trip-route';
import TripInfoController from './controllers/trip-info';
import FilterController from './controllers/filter';
import MenuComponent from './components/menu';
import StatisticsComponent from './components/statistics';
import {generateEvents} from './mock/event';
import {RenderPosition, render} from './utils/render';
import {MenuItem} from './components/menu';

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

// статистика
const pageContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const statisticsComponent = new StatisticsComponent(eventsModel);
render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

// клик по кнопке New event
const addEventButton = siteHeaderContainer.querySelector(`.trip-main__event-add-btn`);
addEventButton.addEventListener(`click`, () => {
  tripRouteController.createEvent();
});

// смена пунктов меню
menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TRIP:
      menuComponent.setActiveItem(MenuItem.TRIP);
      statisticsComponent.hide();
      tripRouteController.show();
      break;
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      statisticsComponent.show();
      tripRouteController.hide();
      break;
  }
});
