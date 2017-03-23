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
    const { condition, timezone } = this.props;
    const sunriseBase = condition.length > 0 ? moment.unix(condition[0].sunriseTime).tz(timezone) : moment().tz(timezone);
    const sunriseTime = condition.length > 0 ? sunriseBase.format('HH:MM') : moment().format('HH:MM');
    const sunsetBase = condition.length > 0 ? moment.unix(condition[0].sunsetTime).tz(timezone) : moment().tz(timezone);
    const sunsetTime = condition.length > 0 ? sunsetBase.format('HH:MM') : moment().format('HH:MM');
    return (
      <Animated.View style={{
        opacity: this.state.fadeAnim,
        position: 'absolute',
        left: 20,
        top: '35%',
        backgroundColor: 'transparent',
      }}
      >
        <DateText>
          <Image style={styles.image} source={require('../../assets/sunrise.png')} />
          {sunriseTime}
        </DateText>
        <DateText>
          <Image style={styles.image} source={require('../../assets/sunset.png')} />
          {sunsetTime}
        </DateText>
      </Animated.View>
    );
  }
}

WeatherDetails.propTypes = {
  condition: React.PropTypes.arrayOf(React.PropTypes.shape({})),
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
