
/* eslint-disable */
const icons = {
  'clear-day': require('../../../assets/sunny.png'),
  'clear-night': require('../../../assets/moon.png'),
  'partly-cloudy-day': require('../../../assets/partlycloudy.png'),
  'partly-cloudy-night': require('../../../assets/mostlycloudy.png'),
  cloudy: require('../../../assets/mostlycloudy.png'),
  wind: require('../../../assets/wind.png'),
  fog: require('../../../assets/fog.png'),
  hail: require('../../../assets/snow.png'),
  tornado: require('../../../assets/tornado.png'),
  thunderstorm: require('../../../assets/tstorms.png'),
  rain: require('../../../assets/rain.png'),
  snow: require('../../../assets/snow.png'),
  'clear-day_white': require('../../../assets/sunny_white.png'),
  'clear-night_white': require('../../../assets/moon_white.png'),
  'partly-cloudy-day_white': require('../../../assets/partlycloudy_white.png'),
  'partly-cloudy-night_white': require('../../../assets/mostlycloudy_white.png'),
  cloudy_white: require('../../../assets/mostlycloudy_white.png'),
  wind_white: require('../../../assets/wind_white.png'),
  fog_white: require('../../../assets/fog_white.png'),
  hail_white: require('../../../assets/snow_white.png'),
  tornado_white: require('../../../assets/tornado_white.png'),
  thunderstorm_white: require('../../../assets/tstorms_white.png'),
  rain_white: require('../../../assets/rain_white.png'),
  snow_white: require('../../../assets/snow_white.png'),
};
/* eslint-enable */

const identifyIcon = (icon) => {
  if (icon in icons) {
    return icons[icon];
  }
  return null;
};

module.exports = {
  icons,
  identifyIcon,
};
