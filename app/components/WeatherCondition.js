import React, { PropTypes, PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';
import Colors from './utils/Colors';

// Components
import DateText from './styled/DateText';
import Temperature from './utils/Temperature';

const formatText = (temp, humidity, precip) => {
  return `Feels like ${parseFloat(temp).toFixed(0)}°
Humidity ${parseFloat(humidity * 100).toFixed(0)}%
${precip}`;
};

export default class WeatherCondition extends PureComponent { // eslint-disable-line
  render() {
    const { condition, day, toggleDetails, unit, alerts, toggleAlert } = this.props;
    const precipProbable = condition.precipProbability > 0;
    const precipType = condition.precipType || 'rain';

    // Get temperature and convert if needed
    const temperature = unit === 'c' ? condition.temperature :
    Temperature.convertToFahrenheit(condition.temperature);

    // Get Apparent temperature and convert if needed
    const apparentTemperature = unit === 'c' ? condition.apparentTemperature :
    Temperature.convertToFahrenheit(condition.apparentTemperature);
    const fontColor = Colors.identifyFontColor(condition.icon);

    const fixedTemp = parseFloat(temperature).toFixed(0);
    const fixedFeelsLike = parseFloat(apparentTemperature).toFixed(0);
    const precipNumber = precipProbable ? parseFloat(condition.precipProbability * 100).toFixed(2) : 0;
    const precipitation = precipProbable ? `Chance of ${precipType}: ${precipNumber}%` : '';
    const showAlert = alerts.length > 0;
    return (
      <TouchableHighlight style={styles.container} onPress={toggleDetails} underlayColor="transparent">
        <View style={styles.container}>
          <Text style={[styles.temp, { color: fontColor }]}>{fixedTemp}°</Text>
          <Text style={[styles.condition, { color: fontColor }]}>
            {condition.summary}
            { showAlert &&
              <TouchableHighlight style={{ width: 25, height: 25 }} onPress={toggleAlert} underlayColor="transparent">
                <Image style={styles.image} source={require('../../assets/alert_icon.png')} />
              </TouchableHighlight>
            }
          </Text>
          <DateText space style={{ color: fontColor }} day={day}>
            {formatText(fixedFeelsLike, condition.humidity, precipitation)}
          </DateText>
        </View>
      </TouchableHighlight>
    );
  }
}

WeatherCondition.propTypes = {
  condition: PropTypes.shape({}),
  unit: PropTypes.string,
  day: PropTypes.bool,
  toggleAlert: PropTypes.func,
  toggleDetails: PropTypes.func,
  alerts: PropTypes.arrayOf(PropTypes.shape({})),
};

const styles = StyleSheet.create({
  container: {
    top: '9.5%',
    position: 'absolute',
    left: '5%',
    backgroundColor: 'transparent',
  },
  image: {
    width: 20,
    height: 20,
    marginTop: 5,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  temp: {
    fontSize: 50,
    fontFamily: 'HelveticaNeue',
    fontWeight: '600',
    color: '#F9F9F9',
  },
  condition: {
    fontSize: 24,
    fontFamily: 'HelveticaNeue',
    fontWeight: '600',
    color: '#F9F9F9',
    marginBottom: 20,
  },
});
