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

export default class HourForecast extends PureComponent { // eslint-disable-line
  constructor(props) {
    super(props);
    this.state = {
      bottomAnim: new Animated.Value(-Dimensions.get('window').height / 10),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openHours !== this.props.openHours) {
      this.animateBottom();
    }
  }

  animateBottom() {
    const bottomValue = this.props.openHours ?
    -Dimensions.get('window').height / 10 : Dimensions.get('window').height / 10;
    Animated.timing(
      this.state.bottomAnim,
      { toValue: bottomValue },
    ).start();
  }

  render() {
    const { forecast, unit, timeType, timezone } = this.props;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          height: '20%',
          left: 0,
          bottom: this.state.bottomAnim,
        }}
      >
        <View style={styles.container}>
          {forecast.map((hour, idx) => {
            if (idx > 0 && idx < 6) {
              const zone = timezone || 'America/New_York';
              const temperature = unit === 'c' ? hour.temperature : Temperature.convertToFahrenheit(hour.temperature);
              const adjustedTemp = parseFloat(temperature).toFixed(0);
              const time = moment.unix(hour.time).tz(timezone);
              const timeFormat = timeType === '24' ? 'HH:00' : 'ha';
              return (
                <View style={styles.hour} key={hour.time}>
                  <Text style={styles.hourText}>{time.minutes(0).format(timeFormat)}</Text>
                  <WeatherIconWrapper>
                    <Image style={styles.image} source={Icons.identifyIcon(`${hour.icon}_white`)} />
                  </WeatherIconWrapper>
                  <Text style={styles.temperature}>
                    {adjustedTemp}°
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      </Animated.View>
    );
  }
}

HourForecast.propTypes = {
  forecast: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  unit: React.PropTypes.string,
  openHours: React.PropTypes.bool,
  timeType: React.PropTypes.string,
  timezone: React.PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    position: 'relative',
  },
  hour: {
    width: '20%',
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
