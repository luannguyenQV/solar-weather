// Modules
import React, { PureComponent } from 'react';
import RNGooglePlaces from 'react-native-google-places';
import { connect } from 'react-redux';
import Modal from '../Modal';

import {
  View,
  ListView,
  Image,
} from 'react-native';

import * as locationActions from '../../actions/locationActions';
import Row from './LocationSearchRow';
import Header from './LocationSearchHeader';
import CloseButton from '../CloseButton';

class LocationSearch extends PureComponent { // eslint-disable-line
  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      search: '',
      predictions: ds.cloneWithRows([]),
    };
  }

  LookUpPlace(loc) {
    const id = loc.placeID;
    RNGooglePlaces.lookUpPlaceByID(id)
    .then((place) => {
      this.props.toggleView();
      this.props.dispatch(locationActions.addLocationToStore(
        place.name,
        place.latitude,
        place.longitude,
      ));
    }).catch(error => console.log(error.message));
  }

  getLocations(search) {
    this.setState({
      search,
    }, () => {
      if (this.state.search.length < 2) {
        this.setState({
          predictions: this.state.predictions.cloneWithRows([]),
        });
      } else if (this.state.search.length > 1) {
        RNGooglePlaces.getAutocompletePredictions(this.state.search, {
          type: 'cities',
        }).then(results => this.setState({
          predictions: this.state.predictions.cloneWithRows(results)
        })).catch(error => console.log(error.message));
      }
    });
  }

  render() {
    const { visible, toggleView } = this.props;
    return (
      <Modal
        visible={visible}
        toggleView={toggleView}
        content={<ListView
        keyboardShouldPersistTaps="always"
        scrollEnabled={false}
        enableEmptySections
        dataSource={this.state.predictions}
        renderRow={rowData => <Row {...rowData} handleTap={e => this.LookUpPlace(e)} />}
        renderHeader={() => <Header onChange={text => this.getLocations(text)} />}
        renderFooter={() =>
          <Image
            style={imageStyle}
            source={require('../../../assets/powered_by_google_on_white@2x.png')}
          />
        }
      />}
      />
    );
  }
}

const imageStyle = {
  alignSelf: 'center',
  marginTop: 30,
  width: 120,
  resizeMode: 'contain',
};

const viewWrapper = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
};

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
};

LocationSearch.propTypes = {
  toggleView: React.PropTypes.func,
  visible: React.PropTypes.bool,
  dispatch: React.PropTypes.func,
};

const mapStateToProps = ({ locations }) => ({ locations });
export default connect(mapStateToProps)(LocationSearch);
