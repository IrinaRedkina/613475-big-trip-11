import InfoComponent from '../components/info';
import TripInfoComponent from '../components/trip-info';
import CostComponent from '../components/cost';
import MenuComponent from '../components/menu';
import FilterComponent from '../components/filter';
import {RenderPosition, render} from '../utils/render';

export default class TripHeaderController {
  constructor(container, filters, totalPrice) {
    this._container = container;

    this._infoComponent = new InfoComponent();
    this._menuComponent = new MenuComponent();
    this._filterComponent = new FilterComponent(filters);
    this._costComponent = new CostComponent(totalPrice);
  }

  render(events) {
    const container = this._container;
    const menuContainer = container.querySelector(`.trip-controls`);
    const menuTitle = menuContainer.querySelector(`h2:last-child`);

    render(container, this._infoComponent, RenderPosition.AFTERBEGIN);
    render(this._infoComponent.getElement(), this._costComponent, RenderPosition.BEFOREEND);
    render(menuContainer, this._menuComponent, RenderPosition.INSERTBEFORE, menuTitle);
    render(menuContainer, this._filterComponent, RenderPosition.BEFOREEND);

    if (events.length > 0) {
      const eventsByDays = events.slice().sort((a, b) => a.dueDateStart.getTime() - b.dueDateStart.getTime());
      const tripDateStart = eventsByDays[0].dueDateStart;
      const tirpDateEnd = eventsByDays[eventsByDays.length - 1].dueDateEnd;
      const routePoints = eventsByDays.map((item) => item.city);

      const tripInfoComponent = new TripInfoComponent(tripDateStart, tirpDateEnd, routePoints);
      render(this._infoComponent.getElement(), tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }
}
