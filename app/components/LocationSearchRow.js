import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#EFEFEF',
    marginLeft: 12,
    fontSize: 16,
  },
});

const Row = props => (
  <TouchableOpacity style={styles.button} onPress={() => { props.handleTap(props); }}>
    <View style={styles.container}>
      <Text style={styles.text}>
        {`${props.primaryText}, ${props.secondaryText}`}
      </Text>
    </View>
  </TouchableOpacity>
);

Row.propTypes = {
  handleTap: React.PropTypes.func,
  secondaryText: React.PropTypes.string,
  primaryText: React.PropTypes.string,
};

export default Row;
