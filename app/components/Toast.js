// Modules
import React, { PureComponent } from 'react';

import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';

export default class Toast extends PureComponent { // eslint-disable-line
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      topAnim: new Animated.Value(-100),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.error && nextProps.error || // eslint-disable-line
    this.props.connected && !nextProps.connected) { // eslint-disable-line
      this.toggleError(
        () => {
          Animated.timing(this.state.topAnim, { toValue: 0 }).start();
          const timeout = setTimeout(() => {
            this.toggleError();
            Animated.timing(this.state.topAnim, { toValue: -100 }).start();
            clearTimeout(timeout);
          }, 5000);
        },
      );
    }
  }

  toggleError(cb) {
    this.setState({
      showError: !this.state.showError,
    }, cb);
  }

  render() {
    const { error } = this.props;
    const errorMessage = error || 'No connection';
    return (
      <Animated.View
        style={[
          styles.container,
          { top: this.state.topAnim },
        ]}
      >
        <Text style={styles.text}>{errorMessage}.</Text>
      </Animated.View>
    );
  }
}

Toast.propTypes = {
  connected: React.PropTypes.bool,
  error: React.PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 3,
    left: 0,
    padding: 15,
    backgroundColor: '#E77F6D',
    width: Dimensions.get('window').width,
    height: 50,
  },
  text: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '700',
    fontFamily: 'HelveticaNeue',
  },
});
