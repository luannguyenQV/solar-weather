import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#000',
    borderBottomWidth: 2,
    height: 45,
    marginBottom: 10,
    borderBottomColor: '#EFEFEF',
  },
  input: {
    height: 50,
    color: '#EFEFEF',
    flex: 1,
    fontSize: 15,
  },
});

const Header = (props) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      keyboardAppearance="dark"
      placeholder="Enter City Name"
      placeholderTextColor="grey"
      selectionColor="white"
      spellCheck={false}
      autoFocus
      autoCorrect={false}
      onChangeText={props.onChange}
    />
  </View>
);

Header.propTypes = {
  onChange: React.PropTypes.func,
};

export default Header;