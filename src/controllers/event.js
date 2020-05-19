import EventComponent from '../components/event';
import EditEventComponent from '../components/event-edit';
import EventModel from '../models/event-adapter';
import {Key} from '../utils/common';
import {RenderPosition, render, replace, remove} from '../utils/render';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

const parseFormData = (formData, destinations) => {
  const dateStart = formData.get(`event-start-time`);
  const dateEnd = formData.get(`event-end-time`);

  const city = formData.get(`event-destination`);
  const destination = destinations.filter((it) => it.name === city)[0];

  const options = formData.getAll(`event-offer`).map((option) => {
    const optionData = option.split(`|`);

    return {
      title: optionData[0],
      price: Number(optionData[1])
    };
  });

  return new EventModel({
    "base_price": formData.get(`event-price`),
    "date_from": dateStart ? new Date(dateStart) : null,
    "date_to": dateEnd ? new Date(dateEnd) : null,
    "is_favorite": !!formData.get(`event-favorite`),
    "type": formData.get(`event-type`),
    "destination": destination,
    "offers": options
  });
};

export const emptyEvent = {
  type: `transport`,
  price: ``,
  isFavorite: false,
  dueDateStart: null,
  dueDateEnd: null,
  options: [],
  destination: []
};

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, offers, destinations, mode, beforeElement = null) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(event, offers, destinations);
    this._eventEditComponent = new EditEventComponent(event, offers, destinations, mode);
    this._mode = mode;

    this._eventComponent.setClickEditHandler(() => {
      this._replaceEventToEdit();
    });

    if (this._mode !== Mode.ADDING) {
      this._eventEditComponent.setClickCloseHandler(() => {
        this._replaceEditToEvent();
      });
    }

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, destinations);

      this._onDataChange(this, event, data);

      if (this._mode === Mode.ADDING) {
        remove(this._eventEditComponent);
        this._eventEditComponent.destroyFlatpickr();
      } else {
        this._replaceEditToEvent();
      }
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, event, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.INSERTBEFORE, beforeElement);
        this._eventEditComponent.initFlatpickr();
        break;
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
    this._eventEditComponent.destroyFlatpickr();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._eventEditComponent.reset();
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    this._onViewChange();
    this._eventEditComponent.initFlatpickr();
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    this._eventEditComponent.destroyFlatpickr();
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === Key.ESC || evt.key === Key.ESC_SHORT) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, emptyEvent, null);
      }

      this._eventEditComponent.reset();
      this._replaceEditToEvent();
    }
  }
}
