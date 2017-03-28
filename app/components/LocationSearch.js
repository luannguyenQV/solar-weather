// Modules
import React, { PureComponent } from 'react';
import RNGooglePlaces from 'react-native-google-places';
import { connect } from 'react-redux';

import {
  View,
  Modal,
  ListView,
  Image,
} from 'react-native';

import * as locationActions from '../actions/locationActions';
import Row from './LocationSearchRow';
import Header from './LocationSearchHeader';
import CloseButton from './CloseButton';

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
    const { toggleView, visible } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={visible}
      >
        <View style={{ backgroundColor: 'black', height: '100%' }}>
          <ListView
            keyboardShouldPersistTaps="always"
            scrollEnabled={false}
            enableEmptySections
            dataSource={this.state.predictions}
            renderRow={rowData => <Row {...rowData} handleTap={e => this.LookUpPlace(e)} />}
            renderHeader={() => <Header onChange={text => this.getLocations(text)} />}
            renderFooter={() =>
              <View>
                <Image style={{ alignSelf: 'center', marginTop: 30, opacity: 0.5 }} source={require('../../assets/powered_by_google_on_non_white@2x.png')} />
                <CloseButton
                  absolute={false}
                  toggle={toggleView}
                />
              </View>
            }
          />
        </View>
      </Modal>
    );
  }
}

LocationSearch.propTypes = {
  toggleView: React.PropTypes.func,
  visible: React.PropTypes.bool,
  dispatch: React.PropTypes.func,
};

const mapStateToProps = ({ locations }) => ({ locations });
export default connect(mapStateToProps)(LocationSearch);
