import AbstractComponent from './abstract-component';

export const MenuItem = {
  STATISTICS: `stats`,
  TRIP: `trip`
};

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" data-href="${MenuItem.TRIP}" href="#">Table</a>
      <a class="trip-tabs__btn" data-href="${MenuItem.STATISTICS}" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();

    this._currenMenuItem = MenuItem.TRIP;
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    this._clearActiveItem();

    const item = this.getElement().querySelector(`a[data-href=${menuItem}]`);

    if (item) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  _clearActiveItem() {
    this.getElement().querySelector(`.trip-tabs__btn--active`)
      .classList.remove(`trip-tabs__btn--active`);
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (!evt.target.dataset.href) {
        return;
      }

      const menuItem = evt.target.dataset.href;

      this._currenMenuItem = menuItem;

      handler(menuItem);
    });
  }
}
