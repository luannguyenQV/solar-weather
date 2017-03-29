// Modules
import React, { PureComponent } from 'react';
import moment from 'moment';
import tz from 'moment-timezone';

import {
  StyleSheet,
  Animated,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';

// Components
import Icons from './utils/Icons';
import Temperature from './utils/Temperature';
import WeatherIconWrapper from './styled/WeatherIconWrapper';

export default class HourItem extends PureComponent { // eslint-disable-line
  render() {
    const { unit, timeType, timezone } = this.props;
    const zone = timezone || 'America/New_York';
    const temperature = unit === 'c' ? this.props.temperature :
    Temperature.convertToFahrenheit(this.props.temperature);
    const adjustedTemp = parseFloat(temperature).toFixed(0);
    const time = moment.unix(this.props.time).tz(zone);
    const timeFormat = timeType === '24' ? 'HH:00' : 'ha';
    if (this.props.rowId < 13) {
      return (
        <View style={styles.hour} key={time}>
          <Text style={styles.hourText}>{time.minutes(0).format(timeFormat)}</Text>
          <WeatherIconWrapper>
            <Image style={styles.image} source={Icons.identifyIcon(`${this.props.icon}_white`)} />
          </WeatherIconWrapper>
          <Text style={styles.temperature}>
            {adjustedTemp}°
          </Text>
        </View>
      );
    }
    return null;
  }
}

HourItem.propTypes = {
  unit: React.PropTypes.string,
  timeType: React.PropTypes.string,
  timezone: React.PropTypes.string,
  temperature: React.PropTypes.number,
  time: React.PropTypes.number,
  icon: React.PropTypes.string,
  rowId: React.PropTypes.string,
};

const styles = StyleSheet.create({
  hour: {
    width: '7.65%',
    alignItems: 'center',
    height: '100%',
  },
  hourText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#EFEFEF',
    marginTop: 15,
  },
  image: {
    alignSelf: 'center',
    width: '90%',
    marginTop: -5,
    resizeMode: 'contain',
  },
  temperature: {
    color: '#EFEFEF',
    fontSize: 14,
  },
});
