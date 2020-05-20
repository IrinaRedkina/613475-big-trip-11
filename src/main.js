import API from './api/index.js';
import Provider from './api/provider';
import Store from './api/store';
import EventsModel from './models/events';
import OffersModel from './models/offers';
import DestinationsModel from './models/destinations';
import TripRouteController from './controllers/trip-route';
import TripInfoController from './controllers/trip-info';
import FilterController from './controllers/filter';
import MenuComponent from './components/menu';
import StatisticsComponent from './components/statistics';
import LoadingComponent from './components/loading';
import {MenuItem} from './components/menu';
import {RenderPosition, render} from './utils/render';
import {addEventButton} from './const';

const AUTHORIZATION = `Basic MyH4ckBwZXMzd32yZA6+`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const OFFLINE_TITLE = `[offline]`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);
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
const tripRouteController = new TripRouteController(tripRouteContainer, eventsModel, offersModel, destinationsModel, apiWithProvider);

// статистика
const pageContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const statisticsComponent = new StatisticsComponent(eventsModel);
render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

// loading
const loadingComponent = new LoadingComponent();
render(pageContainer, loadingComponent, RenderPosition.BEFOREEND);

// клик по кнопке New event
addEventButton.addEventListener(`click`, (evt) => {
  evt.target.setAttribute(`disabled`, `disabled`);
  evt.target.blur();
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

Promise.all([
  apiWithProvider.getEvents(),
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations()
]).then((response) => {
  const [events, offers, destinations] = response;

  loadingComponent.getElement().remove();
  loadingComponent.removeElement();

  eventsModel.setEvents(events);
  offersModel.setOffers(offers);
  destinationsModel.setOffers(destinations);

  tripRouteController.render();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации SW
    }).catch(() => {
      // Действие, в случае ошибки при регистрации SW
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` ${OFFLINE_TITLE}`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` ${OFFLINE_TITLE}`;
});
