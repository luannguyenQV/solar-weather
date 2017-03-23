import React, { PureComponent } from 'react';
import moment from 'moment';
import tz from 'moment-timezone';
import {
  StyleSheet,
  View,
} from 'react-native';

// Components
import DateText from './styled/DateText';
import Colors from './utils/Colors';

export default class DateDisplay extends PureComponent { // eslint-disable-line
  render() {
    const { condition, day, timestamp, time, timezone } = this.props;
    const formatString = time === '24' ? 'HH:mm' : 'h:mma';
    const zone = timezone || 'America/New_York';
    const adjustedTime = moment(timestamp).tz(zone);
    const formattedTimestamp = adjustedTime.format(formatString);
    const dateStamp = adjustedTime.format('MMMM DD');
    const fontColor = Colors.identifyFontColor(condition);
    return (
      <View style={styles.container}>
        <DateText style={{ color: fontColor }} day={day}>
          {formattedTimestamp}
        </DateText>
        <DateText style={{ color: fontColor }} day={day}>
          {dateStamp}
        </DateText>
      </View>
    );
  }
}

DateDisplay.propTypes = {
  day: React.PropTypes.bool,
  timestamp: React.PropTypes.shape({}),
  time: React.PropTypes.string,
  condition: React.PropTypes.string,
  timezone: React.PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '2.5%',
    left: '5%',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
});
