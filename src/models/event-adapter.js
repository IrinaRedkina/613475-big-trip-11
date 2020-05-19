export default class EventAdapter {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.price = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
    this.dueDateStart = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.dueDateEnd = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.options = data[`offers`];
    this.destination = data[`destination`];
  }

  toRAW() {
    return {
      "id": this.id,
      "base_price": Number(this.price),
      "date_from": this.dueDateStart ? this.dueDateStart.toISOString() : null,
      "date_to": this.dueDateEnd ? this.dueDateEnd.toISOString() : null,
      "destination": this.destination,
      "is_favorite": this.isFavorite,
      "offers": this.options,
      "type": this.type
    };
  }

  static parseEvent(data) {
    return new EventAdapter(data);
  }

  static parseEvents(data) {
    return data.map(EventAdapter.parseEvent);
  }

  static clone(data) {
    return new EventAdapter(data.toRAW());
  }
}
