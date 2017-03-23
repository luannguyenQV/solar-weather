import React, { PureComponent } from 'react';
import Colors from './utils/Colors';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

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
    const { condition, day, toggleDetails, unit } = this.props;
    const precipProbable = condition.precipProbability > 0.3;
    const precipType = condition.precipType;

    // Get temperature and convert if needed
    const temperature = unit === 'c' ? condition.temperature :
    Temperature.convertToFahrenheit(condition.temperature);

    // Get Apparent temperature and convert if needed
    const apparentTemperature = unit === 'c' ? condition.apparentTemperature :
    Temperature.convertToFahrenheit(condition.apparentTemperature);
    const fontColor = Colors.identifyFontColor(condition.icon);

    const fixedTemp = parseFloat(temperature).toFixed(0);
    const fixedFeelsLike = parseFloat(apparentTemperature).toFixed(0);
    const precipitation = precipProbable ? `Chance of ${precipType}: ${precipProbable * 100}%` : '';
    return (
      <TouchableHighlight style={styles.container} onPress={toggleDetails} underlayColor="transparent">
        <View style={styles.container}>
          <Text style={[styles.temp, { color: fontColor }]}>{fixedTemp}°</Text>
          <Text style={[styles.condition, { color: fontColor }]}>
            {condition.summary}
          </Text>
          <DateText style={{ color: fontColor }} day={day}>
            {formatText(fixedFeelsLike, condition.humidity, precipitation)}
          </DateText>
        </View>
      </TouchableHighlight>
    );
  }
}

WeatherCondition.propTypes = {
  condition: React.PropTypes.shape({}),
  unit: React.PropTypes.string,
  day: React.PropTypes.bool,
  toggleDetails: React.PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    top: '9.5%',
    position: 'absolute',
    left: '5%',
    backgroundColor: 'transparent',
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
