const createOfferMarkup = (option, isSelected) => {
  const {id, title, price} = option;

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${id}"
        type="checkbox"
        name="event-offer-${id}"
        data-option="${id}"
        ${isSelected ? `checked` : ``}
      >
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

export const createOffersMarkup = (options, selectedOptions) => {
  const offersMarkup = options
    .map((option) => createOfferMarkup(option, selectedOptions[option.id]))
    .join(`\n`);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>`
  );
};
