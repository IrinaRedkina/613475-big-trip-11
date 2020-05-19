export const createCitiesMarkup = (cities) => {
  return cities
    .map((city) => `<option value="${city}">${city}</option>`)
    .join(`\n`);
};

export const createDestinationMarkup = (destination) => {
  const {description, pictures} = destination;

  const photosMarkup = pictures
    .map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join(`\n`);

  return (
    `<section class="event__section  event__section--destination">
      ${description.length > 0 || pictures.length > 0 ? `
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ` : ``}

      ${description.length > 0 ? `
      <p class="event__destination-description">${description}</p>
      ` : ``}

      ${pictures.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosMarkup}
        </div>
      </div>
      ` : ``}
    </section>`
  );
};
