export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(destinations) {
    this._destinations = Array.from(destinations);
  }
}
