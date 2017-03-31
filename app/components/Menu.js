// Modules
import React, { PureComponent } from 'react';
import {
  Dimensions,
  Animated,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  Text,
  Linking,
  SegmentedControlIOS,
} from 'react-native';

import CloseButton from './CloseButton';
import Modal from './Modal';

export default class Menu extends PureComponent { // eslint-disable-line
  handleClick = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  render() {
    const {
      handleMenu,
      menu,
      unitIndex,
      timeIndex,
      updateIndex,
      updateTimeIndex,
    } = this.props;

    return (
      <Modal
        visible={menu}
        toggleView={handleMenu}
        content={
          <View style={{ position: 'relative', alignItems: 'center' }}>
            <Text style={styles.title}>Settings</Text>
            <SegmentedControlIOS
              id="unit"
              style={{ backgroundColor: 'transparent', width: '80%' }}
              tintColor="#343434"
              values={['Metric', 'Imperial']}
              selectedIndex={unitIndex}
              onChange={updateIndex}
            />
            <SegmentedControlIOS
              style={{ backgroundColor: 'transparent', width: '80%', marginTop: 20 }}
              tintColor="#343434"
              values={['24 Hour', '12 Hour']}
              selectedIndex={timeIndex}
              onChange={updateTimeIndex}
            />
            <Text style={{ color: '#343434', fontWeight: 'bold', marginTop: 90 }}>
              Credits
            </Text>
            <TouchableHighlight onPress={(e) => { this.handleClick('http://germanicons.com/')}}>
            <Text style={{ color: '#343434' }}>Icons: Ralf Schmitzer</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={(e) => { this.handleClick('http://www.maxrandall.com/')}}
            >
              <Text style={{ color: '#343434' }}> & Max Randall</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={(e) => { this.handleClick('https://darksky.net/poweredby/')}}
            >
              <Image style={styles.image} source={require('../../assets/poweredby.png')} />
            </TouchableHighlight>
          </View> 
        }
      />
    );
  }
}

Menu.propTypes = {
  handleMenu: React.PropTypes.func,
  timeIndex: React.PropTypes.number,
  unitIndex: React.PropTypes.number,
  updateIndex: React.PropTypes.func,
  updateTimeIndex: React.PropTypes.func,
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: 'HelveticaNeue',
    marginTop: 20,
    marginBottom: 20,
    color: '#343434',
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
  credits: {
    alignItems: 'center',
    bottom: 40,
    width: '100%',
  },
});
