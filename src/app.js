const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');


const app = express();

// Define paths for Express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDir));

const PORT = process.env.PORT || 3000;

app.get('', (req, res) => {
  res.render('index', {
    head: 'Weather',
    title: 'Weather',
    helpText: 'Use this site to get weather!',
  });
});

app.get('/about', (req, res) => {
  res.render('page', {
    head: 'About',
    title: 'About',
  });
});

const renderError = (res, errorMessage) => res.render('error', {
  head: 'API error',
  title: 'API error',
  errorMessage,
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return renderError(res, 'Please provide address query');
  }
  geocode(req.query.address, (error, data = {}) => {
    if (error) {
      return renderError(res, error);
    }
    const {lat, lng, location} = data;
    forecast(lat, lng, (error, data) => {
      if (error) {
        return renderError(res, error);
      }
      res.send({
        address: req.query.address,
        forecast: data,
        location,
      });
    });
  });

});

app.get('/help', (req, res) => {
  res.render('page', {
    head: 'Help',
    title: 'Help',
  });
});

app.get('/help/*', (req, res) => {
  res.render('error', {
    head: 'Help article not found',
    title: '404',
    errorMessage: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('error', {
    head: 'Page not found',
    title: '404',
    errorMessage: 'Page not found',
  });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});
