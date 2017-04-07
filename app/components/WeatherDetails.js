import React, { PureComponent } from 'react';
import moment from 'moment';
import tz from 'moment-timezone';

import {
  Animated,
  Image,
  StyleSheet,
} from 'react-native';

// Components
import DateText from './styled/DateText';

export default class WeatherDetails extends PureComponent { // eslint-disable-line
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openDetails !== this.props.openDetails) {
      this.triggerAnimation();
    }
  }

  triggerAnimation() {
    const opacityValue = this.props.openDetails ? 0 : 1;
    Animated.timing(
      this.state.fadeAnim,
      { toValue: opacityValue },
    ).start();
  }

  render() {
    const { condition, timezone, currently } = this.props;
    const current = condition.length > 0 ? condition[0] : { sunriseTime: moment(), sunsetTime: moment() };
    const currentPrecipitationAboveLimit = currently.precipProbability > 0;
    const sunriseBase = moment.unix(current.sunriseTime).tz(timezone);
    const sunriseTime = sunriseBase.format('HH:MM');
    const sunsetBase = moment.unix(current.sunsetTime).tz(timezone);
    const sunsetTime = sunsetBase.format('HH:MM');
    return (
      <Animated.View
        style={{
          opacity: this.state.fadeAnim,
          position: 'absolute',
          left: 20,
          top: currentPrecipitationAboveLimit ? '33%' : '31%',
          backgroundColor: 'transparent',
        }}
      >
        <DateText>
          <Image style={styles.image} source={require('../../assets/weather_icons/sunrise.png')} />
          {sunriseTime}
        </DateText>
        <DateText>
          <Image style={styles.image} source={require('../../assets/weather_icons/sunset.png')} />
          {sunsetTime}
        </DateText>
      </Animated.View>
    );
  }
}

WeatherDetails.propTypes = {
  condition: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  currently: React.PropTypes.shape({}),
  openDetails: React.PropTypes.bool,
  timezone: React.PropTypes.string,
};

const styles = StyleSheet.create({
  image: {
    width: 35,
    marginLeft: -5,
    height: 35,
    marginTop: 10,
    resizeMode: 'cover',
  },
});
