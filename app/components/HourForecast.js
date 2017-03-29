// Modules
import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Animated,
  ListView,
  Dimensions,
} from 'react-native';

// Components
import HourItem from './HourItem';

export default class HourForecast extends PureComponent { // eslint-disable-line
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      forecast: [],
      bottomAnim: new Animated.Value(-Dimensions.get('window').height / 10),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openHours !== this.props.openHours) {
      this.animateBottom();
    }
    if (nextProps.forecast !== this.props.forecast) {
      this.setState({
        forecast: nextProps.forecast,
        dataSource: this.state.dataSource.cloneWithRows(nextProps.forecast),
      })
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
    const { timeType, unit, timezone } = this.props;
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          height: '20%',
          left: 0,
          flex: 1,
          bottom: this.state.bottomAnim,
        }}
      >
        <ListView
          horizontal
          pagingEnabled
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          enableEmptySections
          showsHorizontalScrollIndicator={false}
          bounces={false}
          directionalLockEnabled
          dataSource={this.state.dataSource}
          renderRow={(rowData, secId, rowId) =>
            <HourItem
              {...rowData}
              unit={unit}
              timeType={timeType}
              timezone={timezone}
              rowId={rowId}
            />
          }
        />
      </Animated.View>
    );
  }
}

HourForecast.propTypes = {
  forecast: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  openHours: React.PropTypes.bool,
  timeType: React.PropTypes.string,
  unit: React.PropTypes.string,
  timezone: React.PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    minWidth: '250%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    position: 'relative',
  },
});
