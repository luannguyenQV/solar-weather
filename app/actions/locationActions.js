import axios from 'axios';
import Config from 'react-native-config';
import * as types from './actionTypes';
import models from '../realm/Locations';

const setLocation = (index, location) => {
  return {
    type: types.SET_LOCATION,
    index,
    location,
  };
};

const locationLoading = () => {
  return {
    type: types.LOCATION_LOADING,
  };
};

const setLocationSettings = (index) => {
  return {
    type: types.SET_ACTIVE_LOCATION,
    index,
  };
};

const locationError = (err, type) => {
  return {
    type,
    err,
  };
};

const forecastRequest = (lat, lng) => {
  return axios(`https://api.darksky.net/forecast/${Config.FORECAST_API}/${lat},${lng}`, {
    params: {
      exclude: 'minutely',
      units: 'si',
      lang: 'en',
    },
  });
};

export function setActiveLocation(index) {
  models.realm.write(() => {
    models.realm.create('Options', { key: 1, locationIndex: index }, true);
  });
  return (dispatch) => {
    dispatch(setLocationSettings(index));
  };
}

const getLocation = (locs) => {
  return {
    type: types.GET_LOCATIONS,
    locations: locs,
  };
};

const getStoredLocations = () => {
  const locations = models.realm.objects('Location').sorted('id');
  const locArray = locations.map(x => Object.assign({}, x));
  return locArray.length > 0 ? locArray : [];
};

const addIndex = (location) => {
  return {
    type: types.ADD_INDEX_LOCATION,
    location,
  };
};

const writeLocationToStore = (location, id) => {
  const identity = typeof id === 'number' ? id : new Date().getTime();
  models.realm.write(() => {
    const loc = models.realm.create('Location', {
      key: identity,
      ...location,
      id: identity,
      last_updated: new Date(),
      created_at: new Date(),
    }, true);
    location.daily.data.forEach((item, idx) => {
      if (idx < 8) {
        loc.daily.data.push(item);
      }
    });
    location.hourly.data.forEach((item, idx) => {
      if (idx < 8) {
        loc.hourly.data.push(item);
      }
    });
  });
};

export function getLocationsFromStore() {
  const locs = getStoredLocations();
  return (dispatch) => {
    dispatch(getLocation(locs));
  };
}

export function addIndexLocation(name, lat, lng) {
  const location = {
    name,
    lat,
    lng,
  };

  return (dispatch) => {
    forecastRequest(lat, lng).then((res) => {
      const locBase = {
        timezone: res.data.timezone,
        offset: res.data.offset,
      };
      const extendedLocation = Object.assign(
        location,
        locBase,
        { hourly: {
          summary: res.data.hourly.summary,
          icon: res.data.hourly.icon,
          data: res.data.hourly.data.filter((item, idx) => { return idx < 6 }) },
        },
        { currently: res.data.currently },
        { daily: {
          summary: res.data.daily.summary,
          icon: res.data.daily.icon,
          data: res.data.daily.data.filter((item, idx) => { return idx < 6 }) },
        },
      );
      writeLocationToStore(extendedLocation, 0);
      dispatch(addIndex(extendedLocation));
      dispatch(getLocationsFromStore());
    }).catch((err) => {
      dispatch(locationError(err, types.ADD_INDEX_LOCATION_ERROR));
    });
  };
}

const addLocation = (location) => {
  return {
    type: types.ADD_LOCATION,
    location,
  };
};

const addLocationError = (err) => {
  return {
    type: types.ADD_LOCATION_ERROR,
    err,
  };
};

const checkLocationExists = (locs, name) => {
  const filtered = locs.filter((item) => {
    return item.name === name;
  });
  return filtered.length > 0;
};

export function addLocationToStore(name, lat, lng, id, index) {
  const locs = getStoredLocations();
  const location = {
    name,
    lat,
    lng,
  };
  const locationCheck = checkLocationExists(locs, name, lat);

  return (dispatch) => {
    dispatch(locationLoading());
    forecastRequest(lat, lng).then((res) => {
      const locBase = {
        last_updated: new Date(),
        timezone: res.data.timezone,
        offset: res.data.offset,
      };
      const extendedLocation = Object.assign(
        { id: id || new Date().getTime() },
        location,
        locBase,
        { hourly: {
          summary: res.data.hourly.summary,
          icon: res.data.hourly.icon,
          data: res.data.hourly.data.filter((item, idx) => { return idx < 6 }) },
        },
        { currently: res.data.currently },
        { daily: {
          summary: res.data.daily.summary,
          icon: res.data.daily.icon,
          data: res.data.daily.data.filter((item, idx) => { return idx < 6 }) },
        },
      );

      if (typeof id === 'number' && index) {
        writeLocationToStore(extendedLocation, id);
        dispatch(setLocation(index, extendedLocation));
      } else if (locs.length < 5 && !locationCheck) {
        writeLocationToStore(extendedLocation, id);
        dispatch(addLocation(extendedLocation));
        dispatch(setLocationSettings(locs.length));
      } else if (locs.length < 5 && locationCheck) {
        dispatch(locationError('Location already added', types.ADD_LOCATION_ERROR));
      }
    }).catch((err) => {
      console.log(err);
      dispatch(locationError(err, types.ADD_LOCATION_ERROR));
    });
  };
}

const removeLocation = (id) => {
  return {
    type: types.DELETE_LOCATION,
    id,
  };
};

const deleteLocation = (id) => {
  const locations = models.realm.objects('Location');
  const location = locations.filtered(`id = ${id}`);
  models.realm.write(() => {
    models.realm.delete(location);
  });
  return (dispatch) => {
    dispatch(setLocationSettings(locations.length - 1));
    dispatch(removeLocation(id));
  };
};

export function deleteLocationFromStore(id) {
  return (dispatch) => {
    dispatch(deleteLocation(id));
  };
}
