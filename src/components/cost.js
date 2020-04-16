import {createElement} from "../util.js";

const createCostTemplate = (totalPrice = 0) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export default class CostComponent {
  constructor(totalPrice) {
    this._totalPrice = totalPrice;
    this._element = null;
  }

  getTemplate() {
    return createCostTemplate(this._totalPrice);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
