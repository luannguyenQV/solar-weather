import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SwipeRow } from 'react-native-swipe-list-view';
import { darken } from 'polished';

import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';

import * as locationActions from '../actions/locationActions';
import Icons from './utils/Icons';
import Colors from './utils/Colors';
import WeatherIconWrapper from './styled/WeatherIconWrapper';

class Location extends PureComponent { // eslint-disable-line
  render() {
    const { name, lat, lng, icon, day, action, id, index, activeLocation } = this.props;
    const selected = index === activeLocation;
    const background = selected ? darken(0.1, Colors.identifyBackground(icon, day)) : '#EFEFEF';
    const iconName = selected ? `${icon}_white` : icon;
    return (
      <SwipeRow
        onRowPress={() => { this.props.dispatch(locationActions.setActiveLocation(index, lat, lng)); }}
        style={styles.container}
        disableLeftSwipe={!action}
        stopRightSwipe={-40}
        disableRightSwipe
        rightOpenValue={-30}
      >
        <TouchableOpacity style={styles.hidden} onPress={() => { this.props.dispatch(locationActions.deleteLocationFromStore(id)); }}>
          <View style={styles.hiddenWrapper}>
            <Text style={styles.hiddenText}>X</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.main, { backgroundColor: background }]}>
          <Text style={styles.dayTitle}>{name}</Text>
          <WeatherIconWrapper>
            <Image style={styles.image} source={Icons.identifyIcon(iconName)} />
          </WeatherIconWrapper>
        </View>
      </SwipeRow>
    );
  }
}

Location.propTypes = {
  id: React.PropTypes.number,
  action: React.PropTypes.bool,
  name: React.PropTypes.string,
  icon: React.PropTypes.string,
  lat: React.PropTypes.number,
  lng: React.PropTypes.number,
  day: React.PropTypes.bool,
  dispatch: React.PropTypes.func,
  index: React.PropTypes.number,
  activeLocation: React.PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '18%',
    justifyContent: 'center',
    width: '100%',
  },
  main: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  hidden: {
    width: '100%',
    height: '100%',
  },
  hiddenWrapper: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#CB4C4C',
  },
  hiddenText: {
    color: '#EFEFEF',
    marginRight: 10,
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'right',
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
    fontSize: 14,
    marginTop: 5,
  },
});

export default connect()(Location);
