const getWeather = async (location = '', callback = () => {}) => {
  try {
    const resp = await fetch(`/weather?address=${location}`);
    const res = await resp.json();
    callback(undefined, res);
  } catch (e) {
    callback('Unable to find location');
  }

};

const weatherForm = document.querySelector('form');
const input = document.querySelector('input');
const successText = document.querySelector('p.success');
const errorText = document.querySelector('p.error');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  successText.innerHTML = 'Loading...';
  errorText.innerHTML = '';
  if (input.value) {
    return getWeather(input.value, (error, res) => {
      successText.innerHTML = error ? error : res.location;
      errorText.innerHTML = error ? '' : res.forecast;
    });
  } else {
    successText.innerHTML = '';
    errorText.innerHTML = 'You must provide address!';
  }
});
