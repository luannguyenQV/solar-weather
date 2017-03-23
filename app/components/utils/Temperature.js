const convertToFahrenheit = (temp) => {
  return temp * (9/5) + 32; // eslint-disable-line
};

const convertToCelsius = (temp) => {
  return temp - 32 * (5/9); // eslint-disable-line
};

const fixTemperature = (temp) => {
  return parseFloat(temp).toFixed(0);
};

module.exports = {
  convertToCelsius,
  convertToFahrenheit,
  fixTemperature,
};
