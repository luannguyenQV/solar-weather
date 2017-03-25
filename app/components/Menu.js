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

export default class Menu extends PureComponent { // eslint-disable-line
  constructor() {
    super();
    this.state = {
      slideInAnim: new Animated.Value(-Dimensions.get('window').height),
    };
  }

   handleClick = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.menu !== this.props.menu) {
      this.triggerAnimation();
    }
  }

  triggerAnimation() {
    const topValue = this.props.menu ? -Dimensions.get('window').height : 0;
    Animated.timing(
      this.state.slideInAnim,
      { toValue: topValue },
    ).start();
  }

  render() {
    const {
      handleMenu,
      unitIndex,
      timeIndex,
      updateIndex,
      updateTimeIndex,
    } = this.props;

    return (
      <Animated.View
        style={{
          position: 'relative',
          alignItems: 'center',
          zIndex: 2,
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          top: this.state.slideInAnim,
          left: 0,
        }}
      >
        <Text style={styles.title}>Settings</Text>
        <SegmentedControlIOS
          id="unit"
          style={{ backgroundColor: 'transparent', width: '80%' }}
          tintColor="#FFF"
          values={['Metric', 'Imperial']}
          selectedIndex={unitIndex}
          onChange={updateIndex}
        />
        <SegmentedControlIOS
          style={{ backgroundColor: 'transparent', width: '80%', marginTop: 20 }}
          tintColor="#FFF"
          values={['24 Hour', '12 Hour']}
          selectedIndex={timeIndex}
          onChange={updateTimeIndex}
        />
        <View style={styles.credits}>
          <Text 
            style={{ color: '#FFF', fontWeight: 'bold', marginBottom: 10 }}
          >
            Credits
          </Text>
          <TouchableHighlight
            onPress={(e) => { this.handleClick('http://germanicons.com/')}}
          >
            <Text style={{ color: '#FFF' }}>Icons: Ralf Schmitzer</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={(e) => { this.handleClick('http://www.maxrandall.com/')}}
          >
            <Text style={{ color: '#FFF' }}> & Max Randall</Text>
          </TouchableHighlight>
          <Image style={styles.image} source={require('../../assets/forecastlogo.png')} />
        </View>
        <TouchableHighlight style={styles.button} underlayColor="transparent" onPress={handleMenu}>
          <View style={{ borderRadius: 20, width: 40, height: 40, borderColor: '#FFF', borderWidth: 2 }}>
            <Text style={styles.text}>X</Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
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
    color: '#FFF',
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 30,
  },
  text: {
    fontFamily: 'Avenir',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFF',
  },
  image: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
  credits: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    width: '100%',
  },
});
