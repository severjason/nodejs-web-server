const axios = require('axios');
const {DARK_SKY_KEY} = require('../constants');

const URL = 'https://api.darksky.net/forecast/';

const getForecastUrl = (lat, lng) => `${URL}${DARK_SKY_KEY}/${lat},${lng}`;

const forecast = (lat, lng, callback = () => {}) => {
  if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
    callback('Coordinates are incorrect!');
  } else {
    axios.get(getForecastUrl(lat, lng), {params: {units: 'si'}}).then(response => {
      const currently = response.data.currently;
      callback(undefined, `${currently.summary}. It is currently ${currently.temperature} degrees out. There is ${currently.precipProbability}% chance of rain`);
    }).catch(error => {
      callback(error.response ? error.response.data.error : 'Unable to connect to weather service!');
    });
  }
};

module.exports = forecast;
