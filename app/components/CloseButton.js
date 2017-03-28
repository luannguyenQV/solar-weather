// Modules
import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';

export default class CloseButton extends PureComponent { // eslint-disable-line
  render() {
    const { toggle, absolute } = this.props;
    const buttonStyle = absolute ? styles.button : styles.buttonRelative;
    return (
      <TouchableHighlight style={buttonStyle} underlayColor="transparent" onPress={toggle}>
        <View style={{ borderRadius: 20, width: 40, height: 40, borderColor: '#FFF', borderWidth: 2 }}>
          <Text style={styles.text}>X</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  buttonRelative: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: 30,
  },
  text: {
    fontFamily: 'Avenir',
    fontSize: 16,
    marginTop: 9,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFF',
  },
  image: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
});

CloseButton.propTypes = {
  toggle: React.PropTypes.func,
};
