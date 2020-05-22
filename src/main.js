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
import {RenderPosition, render, remove} from './utils/render';
import {addEventButton} from './const';

const AUTHORIZATION = `Basic MyH4ckBwZXMzd32yKL6_`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const OFFLINE_TITLE = `[offline]`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);

const siteHeaderContainer = document.querySelector(`.trip-main`);
const controlsContainer = siteHeaderContainer.querySelector(`.trip-controls`);
const menuTitle = siteHeaderContainer.querySelector(`h2:last-child`);
const tripRouteContainer = document.querySelector(`.trip-events`);
const pageContainer = document.querySelector(`.page-body__page-main .page-body__container`);

const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const menuComponent = new MenuComponent();
const loadingComponent = new LoadingComponent();
const statisticsComponent = new StatisticsComponent(eventsModel);

const tripRouteController = new TripRouteController(tripRouteContainer, eventsModel, offersModel, destinationsModel, apiWithProvider);
const tripInfoController = new TripInfoController(siteHeaderContainer, eventsModel);
const filterController = new FilterController(controlsContainer, eventsModel);

render(controlsContainer, menuComponent, RenderPosition.INSERTBEFORE, menuTitle);
render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
render(pageContainer, loadingComponent, RenderPosition.BEFOREEND);
filterController.render();
statisticsComponent.hide();

const switchScreen = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TRIP:
      menuComponent.setActiveItem(MenuItem.TRIP);
      statisticsComponent.hide();
      tripRouteController.show();
      break;
    case MenuItem.STATISTICS:
      menuComponent.setActiveItem(MenuItem.STATISTICS);
      tripRouteController.hide();
      statisticsComponent.show();
      break;
  }
};

menuComponent.setOnChange((menuItem) => {
  switchScreen(menuItem);
});

addEventButton.addEventListener(`click`, (evt) => {
  evt.target.setAttribute(`disabled`, `disabled`);
  evt.target.blur();

  switchScreen(MenuItem.TRIP);

  filterController.resetFilter();
  tripRouteController.createEvent();
});

Promise.all([
  apiWithProvider.getEvents(),
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations()
]).then((response) => {
  const [events, offers, destinations] = response;

  remove(loadingComponent);

  eventsModel.setEvents(events);
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);

  tripRouteController.render();
  tripInfoController.render();
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
