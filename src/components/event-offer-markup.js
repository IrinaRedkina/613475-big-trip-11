const createOfferMarkup = (id, option, isSelected) => {
  const {title, price} = option;

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${id}"
        type="checkbox"
        name="event-offer"
        value="${title}|${price}"
        data-option-title="${title}"
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

export const createOffersMarkup = (selectedOffers, availableOffers) => {
  const selected = selectedOffers.map((offers) => offers.title);

  const offersMarkup = availableOffers
    .map((offer, i) => createOfferMarkup(i, offer, selected.includes(offer.title)))
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
