import EventComponent from '../components/event';
import EditEventComponent from '../components/event-edit';
import {Key} from '../utils/common';
import {RenderPosition, render, replace, remove} from '../utils/render';
import {types, getAvailableOptions} from '../mock/event';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

const emptyEventType = `flight`;
export const emptyEvent = {
  type: emptyEventType,
  city: ``,
  destination: null,
  options: getAvailableOptions(types[emptyEventType].offers),
  selectedOptions: {},
  price: 0,
  isFavorite: false,
  dueDateStart: null,
  dueDateEnd: null,
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

  render(event, mode, beforeElement = null) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EditEventComponent(event, mode);
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

      const data = this._eventEditComponent.getData();
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
