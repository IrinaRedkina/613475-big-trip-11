import {toUpperCaseFirstLetter} from '../util';
import {types, getDefaultEvent} from '../mock/event';
import {createTypeListMarkup} from './event-type';
import {createOffersMarkup} from './event-offer';
import {createCitiesMarkup, createDestinationMarkup} from './event-destination';

const createFavoriteMarkup = (isFavorite, idEvent) => {
  return (
    `<input id="event-favorite-${idEvent}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite-${idEvent}">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createDateTimeMarkup = (startDate, endDate, idEvent) => {
  return (
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${idEvent}">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-${idEvent}" type="text" name="event-start-time" value="${startDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-${idEvent}">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-${idEvent}" type="text" name="event-end-time" value="${endDate}">
    </div>`
  );
};

const createEditEventTemplate = (event = getDefaultEvent(), idEvent = 0, isWithContainer = true) => {
  const {type, city, price, destination, options, selectedOptions, isFavorite, dueDateStart, dueDateEnd} = event;

  const isShowingDestination = destination && (destination.description.length > 0 || destination.photos.length) > 0 ? true : false;
  const isShowingOffers = options ? true : false;
  const isShowingDetails = isShowingDestination || isShowingOffers;

  const typeData = types[type];
  const title = `${toUpperCaseFirstLetter(type)} ${typeData[`placeholder`]}`;

  return (
    `${isWithContainer ? `<li class="trip-events__item" data-id="${idEvent}">` : ``}
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">

          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-${idEvent}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${idEvent}" type="checkbox">
            ${createTypeListMarkup(type, idEvent)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${idEvent}">
              ${title}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-${idEvent}"
              type="text"
              name="event-destination"
              value="${city ? city : ``}"
              list="destination-list-${idEvent}"
            >
            <datalist id="destination-list-${idEvent}">
              ${createCitiesMarkup()}
            </datalist>
          </div>

          ${createDateTimeMarkup(dueDateStart, dueDateEnd, idEvent)}

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${idEvent}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-${idEvent}"
              type="text"
              name="event-price"
              value="${price ? price : ``}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          ${createFavoriteMarkup(isFavorite, idEvent)}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        ${isShowingDetails ? `
        <section class="event__details">
          ${isShowingOffers ? createOffersMarkup(options, selectedOptions, idEvent) : ``}
          ${isShowingDestination ? createDestinationMarkup(destination) : ``}
        </section>
        ` : ``}
      </form>
    ${isWithContainer ? `</li>` : ``}`
  );
};

export {createEditEventTemplate};
