import Drawer from 'react-native-drawer'
import Geocoder from 'react-native-geocoder';
import { bindActionCreators } from 'redux';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import tz from 'moment-timezone';

// Redux Actions
import * as settingsActions from '../actions/settingsActions';
import * as locationActions from '../actions/locationActions';

// Components
import Background from '../components/Background';
import DateDisplay from '../components/DateDisplay';
import LocationDisplay from '../components/LocationDisplay';
import WeatherCondition from '../components/WeatherCondition';
import WeekOverview from '../components/WeekOverview';
import Toast from '../components/Toast';
import InfoIcon from '../components/InfoIcon';
import HourForecast from '../components/HourForecast';
import WeatherDetails from '../components/WeatherDetails';
import Menu from '../components/Menu';
import LocationOverview from '../components/LocationOverview';
import LocationSearch from '../components/LocationSearch/LocationSearch';
import Modal from '../components/Modal';
import AlertContent from '../components/AlertContent';

import {
  AppRegistry,
  AppState,
  TouchableOpacity,
  NetInfo,
  TouchableHighlight,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const units = ['c', 'f'];
const timeTypes = ['24', '12'];

class Dashboard extends PureComponent {
  state = {
    lastPosition: 'unknown',
    isConnected: 'none',
    appState: 'unknown',
    menu: false,
    locationSearch: false,
    openRight: false,
    openLeft: false,
    timestamp: moment(),
    openHours: false,
    openDetails: false,
    openAlert: false,
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.settings.locationIndex !== nextProps.settings.locationIndex) {
      this.fetchForecast(nextProps.settings.locationIndex);
    }
  }

  toggleLocationSearch() {
    this.setState({
      locationSearch: !this.state.locationSearch,
      openRight: false,
      openLeft: false,
    });
  }

  handleMenu() {
    this.setState({
      menu: !this.state.menu,
    });
  }

  updateSegmentIndex(event) {
    const index = event.nativeEvent.selectedSegmentIndex;
    this.props.dispatch(settingsActions.setUnit(units[index], index));
  }

  updateSegmentTimeIndex(event) {
    const index = event.nativeEvent.selectedSegmentIndex;
    this.props.dispatch(settingsActions.setTimeType(timeTypes[index], index));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    AppState.removeEventListener('memoryWarning', this._handleMemoryWarning.bind(this));
    NetInfo.removeEventListener('change', this.handleNetworkType.bind(this));
  }

  handleNetworkType(networkType) {
    this.setState({ isConnected: networkType });
  }

  _handleMemoryWarning = () => {
    this.setState({
      memoryWarnings: this.state.memoryWarnings +1
    });
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      const latestUpdate = this.props.locations.latestCollectiveUpdate;
      const now = moment();
      if (now.diff(latestUpdate, 'minutes') > 5) {
        this.props.dispatch(locationActions.updateAllStoredLocations());
      }
      this.setState({
        timestamp: moment(),
        openRight: false,
        openLeft: false,
      });
    }
    this.setState({ appState: nextAppState });
  }

  fetchForecast(index) {
    if (this.props.settings.locationIndex > 0 || index > 0) {
      const locations = this.props.locations.locations;
      const idx = index || this.props.settings.locationIndex;
      const loc = locations[idx];
      const lastUpdated = moment(loc.last_updated);
      const now = moment();
      // Check if selected location was updated within past 5 minutes
      // In that case avoid updating location details
      if (now.diff(lastUpdated, 'minutes') > 5) {
        this.props.dispatch(locationActions.addLocationToStore(loc.name, loc.lat, loc.lng, false, loc.id, index));
      }
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        let lastPosition = position;
        this.setState({ lastPosition });
        const destination = {
          lat: lastPosition.coords.latitude,
          lng: lastPosition.coords.longitude,
        }

        // Get location forecast amd future days
        Geocoder.geocodePosition(destination)
        .then((res) => {
          const name = res[0].locality;
          const state = res[0].adminArea;
          const lat = lastPosition.coords.latitude;
          const lng = lastPosition.coords.longitude;
          // get forecast for location based on lat/lng and injecft into object
          this.props.dispatch(locationActions.addLocationToStore(name, lat, lng, true));
        }).catch(err => console.log(err));
      }, (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }
  }
  
  componentDidMount() {
    NetInfo.addEventListener('change', this.handleNetworkType.bind(this));
    AppState.addEventListener('change', this._handleAppStateChange);
    AppState.addEventListener('memoryWarning', this._handleMemoryWarning);
    const { isConnected } = this.state;
    const connected = isConnected === 'wifi' || isConnected === 'cell';
    this.props.dispatch(settingsActions.getSettings());

    if (this.props.locations.locations.length > 0) {
      this.fetchForecast();
      this.props.dispatch(locationActions.updateAllStoredLocations());
    } else {
      this.fetchForecast();
    }
    // Initiate interval to update timestamp every 20 seconds.
    setInterval(() => {
      if (connected) {
        this.setState({
          timestamp: moment(),
        });
      }
    }, 20000);
  }

  toggleHours() {
    this.setState({
      openHours: !this.state.openHours,
    });
  }

  toggleDetails() {
    this.setState({
      openDetails: !this.state.openDetails,
    });
  }

  toggleAlert() {
    this.setState({
      openAlert: !this.state.openAlert,
    });
  }

  render() {
    const {
      lastPosition,
      isConnected,
      timestamp,
      openHours,
      menu,
      openRight,
      openLeft,
      openDetails,
      locationSearch,
      openAlert,
    } = this.state;

    const {
      settings,
      locations,
    } = this.props;

    const connected = isConnected === 'wifi' || isConnected === 'cell';
    const activeLocation = locations.locations.length -1 < settings.locationIndex ?
    locations.locations[0] : locations.locations[settings.locationIndex];
    const rightOpen = locations.locationError ? false : null;
    const timezone = activeLocation.timezone || 'America/New_York';
    const eveningTime = moment().tz(timezone).hour(18).minute(0).second(0);
    const dayTime = moment().tz(timezone).isBefore(eveningTime);

    // Alert title and description
    const showAlert = activeLocation.alerts.length > 0;
    const activeAlertTitle = activeLocation.alerts.length > 0 ? activeLocation.alerts[0].title : '';
    const activeAlertDescription = activeLocation.alerts.length > 0 ? activeLocation.alerts[0].description : '';

    return (
      <Drawer
        disabled={menu || locationSearch}
        type="static"
        open={openRight}
        onOpenStart={() => { this.setState({ openRight: true })}}
        onCloseStart={() => { this.setState({ openRight: false })}}
        negotiatePan={true}
        tweenHandler={Drawer.tweenPresets.parallax}
        panOpenMask={0.2}
        initializeOpen = {false}
        closedDrawerOffset={0}
        openDrawerOffset={0.5}
        panThreshold={0.1}
        side="right"
        content={
          <LocationOverview
            day={dayTime}
            activeLocation={settings.locationIndex}
            openModal={this.toggleLocationSearch.bind(this)}
            locations={locations.locations}
            unit={settings.unit}
          />
        }
      >
        <Drawer
          disabled={menu || locationSearch}
          onOpenStart={() => { this.setState({ openLeft: true })}}
          onCloseStart={() => { this.setState({ openLeft: false })}}
          open={openLeft}
          type="static"
          content={
            <WeekOverview
              forecast={Array.from(activeLocation.daily.data || [])}
              unit={settings.unit}
              timezone={timezone}
            />
          }
          negotiatePan={true}
          panThreshold={0.1}
          openDrawerOffset={0.5}
          closedDrawerOffset={0}
          panOpenMask={0.2}
          tweenHandler={Drawer.tweenPresets.parallax}
        >
          <View style={styles.container}>
            <Modal
              visible={openAlert && showAlert}
              toggleView={this.toggleAlert.bind(this)}
              content={<AlertContent title={activeAlertTitle} description={activeAlertDescription} />}
            />
            <LocationSearch
              visible={locationSearch}
              toggleView={this.toggleLocationSearch.bind(this)}
            />
            <Menu
              menu={menu}
              unitIndex={settings.unitIndex}
              timeIndex={settings.timeIndex}
              handleMenu={this.handleMenu.bind(this)}
              updateIndex={this.updateSegmentIndex.bind(this)}
              updateTimeIndex={this.updateSegmentTimeIndex.bind(this)}
            />
            <InfoIcon onPress={this.handleMenu.bind(this)} />
            <Toast
              connected={connected}
              error={locations.locationError}
            />
            <StatusBar
              hidden
              animated
            />
            <Background
              day={dayTime}
              condition={activeLocation.currently}
            />
            <DateDisplay
              time={settings.timeType}
              timestamp={timestamp}
              timezone={timezone}
              day={dayTime}
              condition={activeLocation.currently.icon}
            />
            <WeatherCondition
              unit={settings.unit}
              day={dayTime}
              condition={activeLocation.currently}
              toggleDetails={this.toggleDetails.bind(this)}
              toggleAlert={this.toggleAlert.bind(this)}
              alerts={Array.from(activeLocation.alerts)}
            />
            <WeatherDetails
              timezone={timezone}
              openDetails={openDetails}
              condition={Array.from(activeLocation.daily.data || [])}
            />
            <HourForecast
              timeType={settings.timeType}
              forecast={Array.from(activeLocation.hourly.data)}
              openHours={openHours}
              unit={settings.unit}
              timezone={timezone}
            />
            <LocationDisplay
              loading={locations.loading}
              onPress={this.toggleHours.bind(this)}
              location={locations.locations[settings.locationIndex]}
            />
          </View>
        </Drawer>
      </Drawer>
    );
  }
}

Dashboard.propTypes = {
  dispatch: React.PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const mapStateToProps = ({
  locations,
  settings,
}) => ({
  locations,
  settings,
});

export default connect(mapStateToProps)(Dashboard);
