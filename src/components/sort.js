import AbstractComponent from './abstract-component';

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const SORT_BY_DAY_TEXT = `Day`;

const createSortMarkup = (sortType, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn  ${isChecked ? `trip-sort__btn--active trip-sort__btn--by-increase` : ``}" for="sort-${sortType}" data-sort-type="${sortType}">
        ${sortType}
      </label>
    </div>`
  );
};

const createSortTemplate = (currentSortType) => {
  const sortMarkups = Object.values(SortType)
    .map((sortType) => createSortMarkup(sortType, sortType === currentSortType))
    .join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${SORT_BY_DAY_TEXT}</span>

      ${sortMarkups}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._currenSortType);
  }

  setSortType(sortType) {
    this._currenSortType = sortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (!evt.target.dataset.sortType) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      const itemSortDay = this.getElement().querySelector(`.trip-sort__item--day`);
      itemSortDay.innerHTML = this._currenSortType === SortType.DEFAULT ? SORT_BY_DAY_TEXT : ``;

      handler(this._currenSortType);
    });
  }
}
