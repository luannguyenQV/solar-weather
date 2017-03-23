// Modules
import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

// Components
import Location from './Location';

export default class LocationOverview extends PureComponent { // eslint-disable-line
  render() {
    const { locations, openModal, day, activeLocation } = this.props;
    return (
      <View style={styles.main}>
        <View style={styles.shadow} />
        {locations.map((loc, idx) => {
          return (
            <Location
              action={loc.id !== 0}
              id={loc.id}
              lat={loc.lat}
              lng={loc.lng}
              day={day}
              key={idx}
              index={idx}
              activeLocation={activeLocation}
              name={loc.name}
              icon={loc.currently.icon}
            />
          );
        })}
        <TouchableOpacity
          style={styles.button}
          onPress={openModal}
        >
          <Image style={styles.image} source={require('../../assets/addIcon.png')} />
        </TouchableOpacity>
      </View>
    );
  }
}

LocationOverview.propTypes = {
  locations: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  day: React.PropTypes.bool,
  openModal: React.PropTypes.func,
  activeLocation: React.PropTypes.number,
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-start',
    backgroundColor: '#EFEFEF',
  },
  shadow: {
    width: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    zIndex: 2,
  },
  button: {
    position: 'absolute',
    bottom: 20,
  },
  image: {
    alignSelf: 'center',
    width: '40%',
    height: 25,
    resizeMode: 'contain',
  },
});
