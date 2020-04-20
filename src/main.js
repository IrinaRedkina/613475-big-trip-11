import TripRouteController from './controllers/trip-route';
import TripHeaderController from './controllers/trip-header';
import {generateEvents} from './mock/event';
import {filters} from './mock/filter';

const TRIP_EVENT_COUNT = 5;
const events = generateEvents(TRIP_EVENT_COUNT);

const totalPrice = events ? events.reduce((acc, event) => acc + event.price, 0) : 0;

const siteHeaderContainer = document.querySelector(`.trip-main`);
const tripHeaderController = new TripHeaderController(siteHeaderContainer, filters, totalPrice);
tripHeaderController.render(events);

const tripRouteContainer = document.querySelector(`.trip-events`);
const tripRouteController = new TripRouteController(tripRouteContainer);
tripRouteController.render(events);
