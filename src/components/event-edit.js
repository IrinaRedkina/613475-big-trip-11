import AbstractSmartComponent from './abstract-smart-component';
import {createTypeListMarkup} from './event-type-markup';
import {createOffersMarkup} from './event-offer-markup';
import {createCitiesMarkup, createDestinationMarkup} from './event-destination-markup';
import {toUpperCaseFirstLetter, getTypeGroup} from '../utils/common';
import {addOneDay} from '../utils/date';
import {placeholderGroup} from '../const';
import {Mode as EventControllerMode} from '../controllers/event';
import {encode} from 'he';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";

const ERROR_MESSAGE_CITY_INPUT = `Введите допустимый город`;

export const DefaultButtonText = {
  delete: `Delete`,
  save: `Save`,
};

const destinationElementBorderColor = {
  VALID: `#0d8ae4`,
  INVALID: `red`
};

const getAvailableOffers = (type, offers) => {
  return offers.filter((offer) => offer.type === type)[0].offers;
};

const createFavoriteMarkup = (isFavorite) => {
  return (
    `<input id="event-favorite" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite">
      <span class="visually-hidden">${isFavorite ? `Remove from favorite` : `Add to favorite`}</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createDateTimeMarkup = (startDate, endDate) => {
  return (
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${startDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${endDate}">
    </div>`
  );
};

const createEditEventTemplate = (mode = EventControllerMode.DEFAUTL, options = {}) => {
  const {cities, patternCities, isDestinationShowing, destination, externalData} = options;
  const {dueDateStart, dueDateEnd, isFavorite, selectedOffers, availableOffers, type} = options;
  const {city: notSanitizedCity, price: notSanitizedPrice} = options;

  const placeholder = placeholderGroup[getTypeGroup(type)];
  const title = `${toUpperCaseFirstLetter(type)} ${placeholder}`;

  const city = notSanitizedCity ? encode(notSanitizedCity) : ``;
  const price = notSanitizedPrice ? encode(notSanitizedPrice.toString()) : ``;

  const isOffersShowing = availableOffers.length;
  const isShowingDetails = isOffersShowing || isDestinationShowing;

  const isModeAdding = mode === EventControllerMode.ADDING;

  const deleteButtonText = externalData.delete;
  const saveButtonText = externalData.save;

  return (
    `<li class="trip-events__item">
      <form class="${isModeAdding ? `trip-events__item` : ``} event event--edit" action="#" method="post">
        <header class="event__header">

          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">
            ${createTypeListMarkup(type)}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination">
              ${title}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination"
              type="text"
              name="event-destination"
              value="${city}"
              list="destination-list"
              required
              pattern="${patternCities}"
            >
            <datalist class="destination-list" id="destination-list">
              ${createCitiesMarkup(cities)}
            </datalist>
          </div>

          ${createDateTimeMarkup(dueDateStart, dueDateEnd)}

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price"
              type="text"
              name="event-price"
              value="${price}"
              required
              pattern="^[ 0-9]+$"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
          <button class="event__reset-btn ${!isModeAdding ? `event__delete-btn` : ``}" type="reset">${isModeAdding ? `Cancel` : deleteButtonText}</button>

          ${isModeAdding ? `` : `${createFavoriteMarkup(isFavorite)}`}

          ${isModeAdding ? `` : `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
          `}
        </header>

        ${isShowingDetails ? `
        <section class="event__details">
          ${isOffersShowing ? createOffersMarkup(selectedOffers, availableOffers) : ``}
          ${isDestinationShowing ? createDestinationMarkup(destination) : ``}
        </section>
        ` : ``}
      </form>
    </li>`
  );
};

export default class EditEvent extends AbstractSmartComponent {
  constructor(event, offers, destinations, mode) {
    super();

    this._event = event;
    this._offers = offers;
    this._destinations = destinations;

    this._type = event.type;
    this._destination = event.destination;
    this._city = event.destination[`name`];
    this._selectedOffers = Object.assign([], event.options);
    this._availableOffers = getAvailableOffers(event.type, offers);
    this._price = event.price;
    this._isFavorite = event.isFavorite;
    this._dueDateEnd = event.dueDateEnd;
    this._dueDateStart = event.dueDateStart;

    this._mode = mode;
    this._externalData = DefaultButtonText;

    this._submitHandler = null;
    this._closeEditHandler = null;
    this._deleteButtonClickHandler = null;

    this._dateStartflatpickr = null;
    this._dateEndflatpickr = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._mode, {
      type: this._type,
      price: this._price,
      dueDateStart: this._dueDateStart,
      dueDateEnd: this._dueDateEnd,
      selectedOffers: this._selectedOffers,
      availableOffers: this._availableOffers,
      isFavorite: this._isFavorite,
      externalData: this._externalData,
      city: this._destination[`name`],
      cities: this._getCities(),
      patternCities: this._getCities().join(`|`),
      destination: this._destination,
      isDestinationShowing: this._destinations.filter((it) => it.name === this._city).length
    });
  }

  reset() {
    const event = this._event;
    const offers = this._offers;

    this._type = event.type;
    this._city = event.destination[`name`];
    this._destination = event.destination;
    this._selectedOffers = Object.assign([], event.options);
    this._availableOffers = getAvailableOffers(event.type, offers);
    this._price = event.price;
    this._dueDateEnd = event.dueDateEnd;
    this._dueDateStart = event.dueDateStart;

    this.rerender();
  }

  rerender() {
    super.rerender();
    this.initFlatpickr();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitHandler(this._submitHandler);
    this.setClickCloseHandler(this._closeEditHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  destroyFlatpickr() {
    if (this._dateStartflatpickr || this._dateEndflatpickr) {
      this._dateStartflatpickr.destroy();
      this._dateEndflatpickr.destroy();
      this._dateStartflatpickr = null;
      this._dateEndflatpickr = null;
    }
  }

  initFlatpickr() {
    this.destroyFlatpickr();

    const dateStartInput = this.getElement().querySelector(`input[name=event-start-time]`);
    const dateEndInput = this.getElement().querySelector(`input[name=event-end-time]`);

    const options = {
      enableTime: true,
      altInput: true,
      altFormat: `d/m/Y H:i`,
      defaultDate: this._dueDateStart || `today`,
    };

    this._dateStartflatpickr = flatpickr(dateStartInput, Object.assign({}, options));
    this._dateEndflatpickr = flatpickr(dateEndInput, Object.assign({}, options, {
      minDate: dateStartInput.value,
      defaultDate: this._dueDateEnd || addOneDay(new Date()),
    }));
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    this._setTypeEvent(element);
    this._setOptions(element);
    this._setDates(element);
    this._validateDestination(element);
    this._validatePrice(element);

    if (this._mode !== EventControllerMode.ADDING) {
      element.querySelector(`.event__favorite-checkbox`)
        .addEventListener(`change`, () => {
          this._isFavorite = !this._isFavorite;
          this.rerender();
        });
    }
  }

  _setTypeEvent(element) {
    const typeList = element.querySelector(`.event__type-list`);

    if (typeList) {
      typeList.addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this._availableOffers = getAvailableOffers(evt.target.value, this._offers);
        this._selectedOffers = [];
        this.rerender();
      });
    }
  }

  _setOptions(element) {
    const optionsList = element.querySelector(`.event__available-offers`);

    if (optionsList) {
      optionsList.addEventListener(`change`, (evt) => {
        const title = evt.target.dataset.optionTitle;
        const isChecked = evt.target.checked;

        if (isChecked) {
          const addingItem = this._availableOffers.filter((it) => it.title === title)[0];
          this._selectedOffers.push(addingItem);
        } else {
          this._selectedOffers = this._selectedOffers.filter((it) => it.title !== title);
        }

        this.rerender();
      });
    }
  }

  _setDates(element) {
    const dateStartInput = element.querySelector(`input[name=event-start-time]`);

    dateStartInput.addEventListener(`change`, (evt) => {
      const defaultDateEnd = addOneDay(evt.target.value);

      this._dateEndflatpickr.set(`minDate`, evt.target.value);
      this._dateEndflatpickr.setDate(defaultDateEnd);

      this._dueDateStart = new Date(evt.target.value);
      this._dueDateEnd = addOneDay(this._dueDateStart);

      this.rerender();
    });
  }

  _getDestinationByCity(city) {
    return this._destinations.filter((destination) => destination.name === city)[0];
  }

  _getCities() {
    return this._destinations.map((it) => it.name);
  }

  _setDestination(city) {
    this._city = city;
    this._destination = this._getDestinationByCity(city);

    this.rerender();
  }

  _validateDestination(element) {
    const cityInput = element.querySelector(`.event__input--destination`);
    const groupDestinationElement = element.querySelector(`.event__field-group--destination`);
    const cities = this._getCities();

    cityInput.addEventListener(`input`, (evt) => {
      const city = evt.target.value;

      if (cities.includes(city)) {
        cityInput.setCustomValidity(``);
        groupDestinationElement.style.borderColor = destinationElementBorderColor.VALID;
      } else {
        cityInput.setCustomValidity(ERROR_MESSAGE_CITY_INPUT);
        groupDestinationElement.style.borderColor = destinationElementBorderColor.INVALID;
      }
    });

    cityInput.addEventListener(`change`, (evt) => {
      const city = evt.target.value;

      if (cities.includes(city)) {
        this._setDestination(city);
      } else {
        evt.target.value = ``;
      }
    });
  }

  _validatePrice(element) {
    element.querySelector(`.event__input--price`)
      .addEventListener(`input`, (evt) => {
        let value = evt.target.value;

        if (!Number(evt.target.value)) {
          evt.target.value = value.slice(0, -1);
          return;
        }

        this._price = Number(value);
      });
  }

  disabledSubmitForm() {
    this.getElement().querySelector(`form`)
      .querySelectorAll(`input, .event__save-btn, .event__delete-btn`)
      .forEach((element) => element.setAttribute(`disabled`, `disabled`));
  }

  getData() {
    const form = this.getElement().querySelector(`form`);
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultButtonText, data);
    this.rerender();
  }

  setClickCloseHandler(handler) {
    if (this._mode !== EventControllerMode.ADDING) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
        this.reset();
        handler();
      });

      this._closeEditHandler = handler;
    }
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        handler(evt);
      });

    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }
}
