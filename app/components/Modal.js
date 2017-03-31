// Modules
import React, { PureComponent } from 'react';
import {
  View,
  Modal,
  ListView,
  Image,
} from 'react-native';
import CloseButton from './CloseButton';

export default class ModalWrapper extends PureComponent { // eslint-disable-line
  constructor(props) {
    super(props);
  }

  render() {
    const { toggleView, visible, content } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent
      >
        <View style={viewWrapper} />
        <View style={viewBoxStyle}>
          { content}
          <CloseButton
            absolute
            toggle={toggleView}
          />
        </View>
      </Modal>
    );
  }
}

const viewWrapper = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
}

const viewBoxStyle = {
  position: 'relative',
  marginTop: '15%',
  backgroundColor: '#F0F0F0',
  height: '65%',
  width: '85%',
  alignSelf: 'center',
  shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0
    },
  shadowRadius: 5,
  shadowOpacity: 0.8
}

ModalWrapper.propTypes = {
  toggleView: React.PropTypes.func,
  visible: React.PropTypes.bool,
  dispatch: React.PropTypes.func,
};

