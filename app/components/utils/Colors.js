const colors = {
  white: '#FFF',
  black: '#000',
  lightGrey: '#EEEEEE',
  lightOrange: '#F2C992',
  darkOrange: '#FEC272',
  lightBlueGrey: '#99C2E8',
  darkBlueGrey: '#95A5B5',
  lightMatteBlue: '#A5BBCF',
  darkMatteBlue: '#5A6876',
  lightBlue: '#5D74A0',
  darkBlue: '#3C5078',
  lightBeige: '#CEBA9F',
  darkBeige: '#A88F70',
  lightAqua: '#94B4BD',
  darkAqua: '#5A828D',
  lightSquash: '#7C718C',
  darkSquash: '#443E4E',
  darkGrey: '#757575',
  subtleGrey: '#EFEFEF',
  snowGrey: '#C1C7C9',
  snowWhite: '#DEE3E5',
};

const identifyColor = (color) => {
  if (color in colors) {
    return colors[color];
  }
  return null;
};

const identifyBackground = (condition, day) => {
  if (condition === 'clear-night') {
    return colors.darkBlueGrey;
  } else if (condition === 'clear-day') {
    return colors.lightBlueGrey;
  } else if (condition === 'cloudy' || condition === 'partly-cloudy-day' || condition === 'partly-cloudy-night') {
    return day ? colors.lightMatteBlue : colors.darkMatteBlue;
  } else if (condition === 'rain') {
    return day ? colors.lightAqua : colors.darkAqua;
  } else if (condition === 'snow') {
    return day ? colors.white : colors.snowGrey;
  } else if (condition === 'thunderstorm') {
    return day ? colors.lightSquash : colors.darkSquash;
  } else if (condition === 'fog') {
    return day ? colors.lightBlue : colors.darkBlue;
  }
  return colors.lightBlueGrey;
};

const identifyFontColor = (condition) => {
  if (condition === 'snow') {
    return colors.darkGrey;
  }
  return colors.subtleGrey;
};

module.exports = {
  colors,
  identifyColor,
  identifyBackground,
  identifyFontColor,
};
