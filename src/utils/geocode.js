const axios = require('axios');
const {MAP_BOX_TOKEN} = require('../constants');

const MAP_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const getMapUrl = (address) => `${MAP_URL}${encodeURIComponent(address)}.json?access_token=${MAP_BOX_TOKEN}`;

const getGeocode = (address = '', callback = () => {}) => {
  axios.get(getMapUrl(address), {params: {limit: 1}}).then(response => {
    const features = response.data && response.data.features;
    if (features && features.length) {
      const lat = response.data.features[0].center[1];
      const lng = response.data.features[0].center[0];
      callback(undefined, {
        lat,
        lng,
        location: response.data.features[0].place_name,
      })
    } else {
      callback('No results found!')
    }
  }).catch(error => {
    if (error.response) {
      const {error: errorInfo, message} = error.response.data;
      callback(errorInfo || message);
    } else {
      callback('Unable to connect to geolocation service!');
    }
  });
};

module.exports = getGeocode;
