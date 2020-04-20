import InfoComponent from './components/info';
import TripInfoComponent from './components/trip-info';
import CostComponent from './components/cost';
import MenuComponent from './components/menu';
import FilterComponent from './components/filter';
import TripRouteController from './controllers/trip-route';
import {filters} from './mock/filter';
import {generateEvents} from './mock/event';
import {RenderPosition, render} from './utils/render';

const TRIP_EVENT_COUNT = 5;
const events = generateEvents(TRIP_EVENT_COUNT);

const renderTripHeader = (tirpEvents) => {
  const siteHeaderContainer = document.querySelector(`.trip-main`);
  const menuContainer = siteHeaderContainer.querySelector(`.trip-controls`);
  const menuTitle = menuContainer.querySelector(`h2:last-child`);
  const infoComponent = new InfoComponent();

  const totalPrice = tirpEvents ? tirpEvents.reduce((acc, event) => acc + event.price, 0) : 0;

  render(siteHeaderContainer, infoComponent, RenderPosition.AFTERBEGIN);
  render(infoComponent.getElement(), new CostComponent(totalPrice), RenderPosition.BEFOREEND);
  render(menuContainer, new MenuComponent(), RenderPosition.INSERTBEFORE, menuTitle);
  render(menuContainer, new FilterComponent(filters), RenderPosition.BEFOREEND);

  if (tirpEvents.length > 0) {
    const eventsByDays = tirpEvents.slice().sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
    const tripDateStart = eventsByDays[0].dueDateStart;
    const tirpDateEnd = eventsByDays[eventsByDays.length - 1].dueDateEnd;
    const routePoints = eventsByDays.map((item) => item.city);

    const tripInfoComponent = new TripInfoComponent(tripDateStart, tirpDateEnd, routePoints);
    render(infoComponent.getElement(), tripInfoComponent, RenderPosition.AFTERBEGIN);
  }
};

renderTripHeader(events);

const tripRouteContainer = document.querySelector(`.trip-events`);
const tripRouteController = new TripRouteController(tripRouteContainer);
tripRouteController.render(events);
