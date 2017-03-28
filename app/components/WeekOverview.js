// Modules
import React, { PureComponent } from 'react';
import moment from 'moment';
import tz from 'moment-timezone';

import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

// Components
import WeatherIconWrapper from './styled/WeatherIconWrapper';
import Icons from './utils/Icons';
import Temperature from './utils/Temperature';

export default class WeekOverview extends PureComponent { // eslint-disable-line
  render() {
    const { forecast, unit, timezone } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.shadow} />
        {forecast.map((day, idx) => {
          const zone = timezone || 'America/New_York';
          const dayDate = moment.unix(day.time).startOf('day').tz(zone);
          const now = moment().tz(zone).startOf('day');
          if (dayDate.isAfter(now.add(1, 'day')) && idx < 7) {
            const temperatureMax = unit === 'c' ? day.temperatureMax : Temperature.convertToFahrenheit(day.temperatureMax);
            const fixedHighTemp = parseFloat(temperatureMax).toFixed(0);
            const temperatureMin = unit === 'c' ? day.temperatureMin : Temperature.convertToFahrenheit(day.temperatureMin);
            const fixedLowTemp = parseFloat(temperatureMin).toFixed(0);
            const time = dayDate.tz(zone);
            return (
              <View style={forecastDay.container} key={idx}>
                <Text style={forecastDay.dayTitle}>{time.format('dddd')}</Text>
                <WeatherIconWrapper>
                  <Image style={forecastDay.image} source={Icons.identifyIcon(day.icon)} />
                </WeatherIconWrapper>
                <Text style={forecastDay.dayHighTemp}>
                  {fixedHighTemp}°
                  <Text style={forecastDay.dayLowTemp}> / {fixedLowTemp}°</Text>
                </Text>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  }
}

WeekOverview.propTypes = {
  forecast: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  unit: React.PropTypes.string,
  timezone: React.PropTypes.string,
};

const forecastDay = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '19%',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    alignSelf: 'center',
    marginTop: '2%',
    width: '55%',
    resizeMode: 'contain',
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: 'Baskerville',
  },
  dayHighTemp: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayLowTemp: {
    fontSize: 12,
    fontWeight: '400',
  },
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#EFEFEF',
  },
  shadow: {
    width: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    zIndex: 2,
  },
});
