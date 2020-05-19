import API from "./api.js";
import EventsModel from './models/events';
import OffersModel from './models/offers';
import DestinationsModel from './models/destinations';
import TripRouteController from './controllers/trip-route';
import TripInfoController from './controllers/trip-info';
import FilterController from './controllers/filter';
import MenuComponent from './components/menu';
import {MenuItem} from './components/menu';
import StatisticsComponent from './components/statistics';
import LoadingComponent from './components/loading';
import {RenderPosition, render} from './utils/render';

const AUTHORIZATION = `Basic MyH4ckBwZXMzd32yZA6+`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

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
const tripRouteController = new TripRouteController(tripRouteContainer, eventsModel, offersModel, destinationsModel, api);

// статистика
const pageContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const statisticsComponent = new StatisticsComponent(eventsModel);
render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

// loading
const loadingComponent = new LoadingComponent();
render(pageContainer, loadingComponent, RenderPosition.BEFOREEND);

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

api.getData()
  .then((data) => {
    loadingComponent.getElement().remove();
    loadingComponent.removeElement();

    eventsModel.setEvents(data[`events`]);
    offersModel.setOffers(data[`offers`]);
    destinationsModel.setOffers(data[`destinations`]);

    tripRouteController.render();
  });
