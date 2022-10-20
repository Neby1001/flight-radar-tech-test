const { faker } = require('@faker-js/faker');

function createRandomAirport() {
  const id = faker.helpers.unique(faker.random.alpha, [3]).toUpperCase();
  const city = faker.address.city();
  const name = `${city} International Airport`;

  return {
    id,
    name,
    city,
  };
}

const AIRPORTS = [...Array(100)].map(createRandomAirport);

function createRandomAirline() {
  const id = faker.helpers.unique(faker.random.alpha, [2]).toUpperCase();
  const name = `${faker.random.words()} Airline`;

  return {
    id,
    name,
  };
}

const AIRLINES = [...Array(50)].map(createRandomAirline);

function createRandomFlight() {
  const id = faker.helpers.unique(faker.random.alphaNumeric, [8]);
  const airline = faker.helpers.arrayElement(AIRLINES).id;
  const number = `${airline}${faker.random.numeric(4)}`;
  const status = faker.helpers.arrayElement(['live', 'scheduled']);
  const std = (status === 'live' ? faker.date.recent() : faker.date.soon());
  const sta = (faker.date.soon(1, std));
  const from = faker.helpers.arrayElement(AIRPORTS).id;
  const to = faker.helpers.arrayElement(AIRPORTS).id;

  const latitude = faker.address.latitude();
  const longitude = faker.address.longitude();
  const direction = faker.address.direction(true);

  const photographer = faker.internet.userName('Flight', 'Radar');

  const image = '/images/photo.jpg';

  return {
    id,
    airline,
    number,
    status,
    from,
    to,
    std,
    sta,
    latitude,
    longitude,
    direction,
    image,
    photographer,
  }
}

const FLIGHTS = [...Array(500)].map(createRandomFlight);

module.exports = {
  AIRLINES,
  AIRPORTS,
  FLIGHTS,
};
