import AbstractComponent from './abstract-component';

const createFilterMarkup = (filterName, isCheked, isDisabled) => {
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${filterName}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterName}"
        ${isCheked ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkups = filters.map((filter) => createFilterMarkup(filter.name, filter.isChecked, filter.disabled)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkups}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      handler(evt.target.value);
    });
  }
}
