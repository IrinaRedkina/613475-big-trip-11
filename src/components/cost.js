import AbstractComponent from './abstract-component';

const createCostTemplate = (totalPrice = 0) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export default class Cost extends AbstractComponent {
  constructor(totalPrice) {
    super();

    this._totalPrice = totalPrice;
  }

  getTemplate() {
    return createCostTemplate(this._totalPrice);
  }
}
