import {cities} from '../mock/destination';

const createCitiesMarkup = () => {
  return cities
    .map((city) => `<option value="${city}"></option>`)
    .join(`\n`);
};

const createDestinationMarkup = (destination) => {
  const {description, photos} = destination;

  const photosMarkup = photos
    .map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`)
    .join(`\n`);

  return (
    `<section class="event__section  event__section--destination">
      ${description.length > 0 || photos.length > 0 ? `
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ` : ``}

      ${description.length > 0 ? `
      <p class="event__destination-description">${description}</p>
      ` : ``}

      ${photos.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosMarkup}
        </div>
      </div>
      ` : ``}
    </section>`
  );
};

export {createCitiesMarkup, createDestinationMarkup};
