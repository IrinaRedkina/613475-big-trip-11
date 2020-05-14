import AbstractSmartComponent from './abstract-smart-component';
import {createTypeListMarkup} from './event-type-markup';
import {createOffersMarkup} from './event-offer-markup';
import {createCitiesMarkup, createDestinationMarkup} from './event-destination-markup';
import {toUpperCaseFirstLetter} from '../utils/common';
import {types, getAvailableOptions, generateSelectedOptionsDefault} from '../mock/event';
import {Mode as EventControllerMode} from '../controllers/event';
import {destinations} from '../mock/destination';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css";

const MAX_OPTIONS_COUNT = 5;
const ERROR_MESSAGE_CITY_INPUT = `Введите допустимый город`;

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

const createEditEventTemplate = (data = {}, mode = EventControllerMode.DEFAUTL) => {
  const {dueDateStart, dueDateEnd, isFavorite, price, city, destination} = data;
  const {isOffersShowing, isDestinationShowing, citiesPattern} = data;
  const {type, typePlaceholder, options, selectedOptions} = data;

  const isShowingDetails = isDestinationShowing || isOffersShowing;
  const title = `${toUpperCaseFirstLetter(type)} ${typePlaceholder}`;
  const isModeAdding = mode === EventControllerMode.ADDING;

  return (
    `${!isModeAdding ? `<li class="trip-events__item">` : `<div>`}
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
              value="${city ? city : ``}"
              list="destination-list"
              required
              pattern="${citiesPattern}"
            >
            <datalist class="destination-list" id="destination-list">
              ${createCitiesMarkup()}
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
              value="${price ? price : ``}"
              required
              pattern="^[ 0-9]+$"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isModeAdding ? `Cancel` : `Delete`}</button>

          ${isModeAdding ? `` : `${createFavoriteMarkup(isFavorite)}`}

          ${isModeAdding ? `` : `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
          `}
        </header>

        ${isShowingDetails ? `
        <section class="event__details">
          ${isOffersShowing ? createOffersMarkup(options, selectedOptions) : ``}
          ${isDestinationShowing ? createDestinationMarkup(destination) : ``}
        </section>
        ` : ``}
      </form>
    ${!isModeAdding ? `</li>` : `</div>`}`
  );
};

const parseFormData = (formData) => {
  const dateStart = formData.get(`event-start-time`);
  const dateEnd = formData.get(`event-end-time`);

  const city = formData.get(`event-destination`);
  const destination = destinations[city];

  const type = formData.get(`event-type`);
  const options = getAvailableOptions(types[type].offers);
  const allAvailableOffers = generateSelectedOptionsDefault(options);

  return {
    type,
    city,
    destination,
    options,
    price: formData.get(`event-price`),
    dueDateStart: dateStart ? new Date(dateStart) : null,
    dueDateEnd: dateEnd ? new Date(dateEnd) : null,
    selectedOptions: formData.getAll(`event-offer`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, allAvailableOffers)
  };
};


export default class EditEvent extends AbstractSmartComponent {
  constructor(event, mode) {
    super();

    this._event = event;

    this._type = event.type;
    this._typePlaceholder = types[event.type][`placeholder`];
    this._city = event.city;
    this._destination = event.destination;
    this._options = event.options;
    this._selectedOptions = Object.assign({}, event.selectedOptions);
    this._isOffersShowing = event.options.length > 0;
    this._isDestinationShowing = event.destination ? true : false;
    this._price = event.price;
    this._isFavorite = event.isFavorite;
    this._dueDateEnd = event.dueDateEnd;
    this._dueDateStart = event.dueDateStart;
    this._citiesPattern = null;

    this._mode = mode;

    this._submitHandler = null;
    this._closeEditHandler = null;
    this._deleteButtonClickHandler = null;

    this._dateStartflatpickr = null;
    this._dateEndflatpickr = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate({
      type: this._type,
      typePlaceholder: this._typePlaceholder,
      city: this._city,
      options: this._options,
      destination: this._destination,
      selectedOptions: this._selectedOptions,
      isOffersShowing: this._isOffersShowing,
      isDestinationShowing: this._isDestinationShowing,
      price: this._price,
      isFavorite: this._isFavorite,
      dueDateEnd: this._dueDateEnd,
      dueDateStart: this._dueDateStart,
      citiesPattern: this._citiesPattern
    }, this._mode);
  }

  getData() {
    const form = this.getElement().querySelector(`form`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  reset() {
    const event = this._event;

    this._type = event.type;
    this._typePlaceholder = types[event.type][`placeholder`];
    this._city = event.city;
    this._destination = event.destination;
    this._options = event.options;
    this._selectedOptions = Object.assign({}, event.selectedOptions);
    this._isOffersShowing = event.options.length > 0;
    this._isDestinationShowing = event.destination ? true : false;
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

    this._dateStartflatpickr = flatpickr(dateStartInput, {
      enableTime: true,
      defaultDate: this._event.dueDateStart || `today`,
    });

    this._dateEndflatpickr = flatpickr(dateEndInput, {
      enableTime: true,
      defaultDate: this._event.dueDateEnd || `today`,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    this._setTypeEvent(element);
    this._setOptions(element);
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
        const type = evt.target.value;
        const options = getAvailableOptions(types[type][`offers`]).slice(0, MAX_OPTIONS_COUNT);

        this._type = type;
        this._typePlaceholder = evt.target.dataset.placeholder;
        this._options = options;
        this._isOffersShowing = options.length > 0;
        this._selectedOptions = generateSelectedOptionsDefault(options);

        this.rerender();
      });
    }
  }

  _setOptions(element) {
    const optionsList = element.querySelector(`.event__available-offers`);

    if (optionsList) {
      optionsList.addEventListener(`change`, (evt) => {
        this._selectedOptions[evt.target.dataset.option] = evt.target.checked;

        this.rerender();
      });
    }
  }

  _setDestination(city) {
    this._city = city;
    this._destination = destinations[city];
    this._isDestinationShowing = destinations[city] ? true : false;

    this.rerender();
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

  _validateDestination(element) {
    const cityInput = element.querySelector(`.event__input--destination`);

    if (!cityInput) {
      return;
    }

    const citiesOptions = element.querySelector(`.destination-list`).options;
    const cities = Array.from(citiesOptions).map((option) => option.value);
    const patternCities = cities.join(`|`);

    cityInput.setAttribute(`pattern`, patternCities);
    this._citiesPattern = patternCities;

    cityInput.addEventListener(`input`, (evt) => {
      const city = evt.target.value;

      if (cities.includes(city)) {
        cityInput.setCustomValidity(``);
        this._setDestination(city);
      } else {
        cityInput.setCustomValidity(ERROR_MESSAGE_CITY_INPUT);
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
    const formElement = this._mode !== EventControllerMode.ADDING
      ? this.getElement().querySelector(`form`)
      : this.getElement();

    formElement.addEventListener(`submit`, (evt) => {
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
