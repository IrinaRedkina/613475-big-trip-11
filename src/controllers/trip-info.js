import InfoComponent from '../components/info';
import TripInfoComponent from '../components/trip-info';
import CostComponent from '../components/cost';
import {RenderPosition, render} from '../utils/render';

export default class TripInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._infoComponent = new InfoComponent();
    this._costComponent = null;
    this._tripInfoComponent = null;
  }

  render() {
    const events = this._eventsModel.getEvents();
    const container = this._container;

    const totalPrice = this._getTotalPrice(events);
    this._costComponent = this._costComponent = new CostComponent(totalPrice);

    render(container, this._infoComponent, RenderPosition.AFTERBEGIN);
    render(this._infoComponent.getElement(), this._costComponent, RenderPosition.BEFOREEND);

    if (events.length > 0) {
      const eventsByDays = events.slice().sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
      const tripDateStart = eventsByDays[0].dueDateStart;
      const tirpDateEnd = eventsByDays[eventsByDays.length - 1].dueDateEnd;
      const routePoints = eventsByDays.map((item) => item.city);

      this._tripInfoComponent = new TripInfoComponent(tripDateStart, tirpDateEnd, routePoints);
      render(this._infoComponent.getElement(), this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _getTotalPrice(events) {
    if (events.lenght) {
      return 0;
    }

    return events.reduce((acc, event) => acc + event.price, 0);
  }
}
