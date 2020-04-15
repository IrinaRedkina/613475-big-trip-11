const createFilterMarkup = (filterName, isCheked) => {
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${filterName}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterName}"
        ${isCheked ? `checked` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkups = filters.map((filter, i) => createFilterMarkup(filter, i === 0)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkups}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export {createFilterTemplate};
