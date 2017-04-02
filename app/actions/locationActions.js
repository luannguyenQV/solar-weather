import axios from 'axios';
import Config from 'react-native-config';
import * as types from './actionTypes';
import models from '../realm/models';

// Utilities
const forecastRequest = (lat, lng) => {
  return axios(`https://api.darksky.net/forecast/${Config.FORECAST_API}/${lat},${lng}`, {
    params: {
      exclude: 'minutely',
      units: 'si',
      lang: 'en',
    },
  });
};

const forecastResponseExtended = (location, res, id) => {
  const newDate = new Date().getTime();
  const adjustedId = typeof id !== 'number' ? newDate : id;
  const locBase = {
    last_updated: newDate,
    timezone: res.data.timezone,
    offset: res.data.offset,
  };
  return Object.assign(
    { id: adjustedId },
    location,
    locBase,
    { hourly: {
      summary: res.data.hourly.summary,
      icon: res.data.hourly.icon,
      data: res.data.hourly.data.filter((item, idx) => { return idx < 15; }) },
    },
    { alerts: res.data.alerts || [] },
    { currently: res.data.currently },
    { daily: {
      summary: res.data.daily.summary,
      icon: res.data.daily.icon,
      data: res.data.daily.data.filter((item, idx) => { return idx < 7; }) },
    },
  );
};

const checkLocationExists = (locs, name) => {
  const filtered = locs.filter((item) => {
    return item.name === name;
  });
  return filtered.length > 0;
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

// Set Locations
const setLocation = (index, location) => {
  return {
    type: types.SET_LOCATION,
    index,
    location,
  };
};

const setLocationSettings = (index) => {
  return {
    type: types.SET_ACTIVE_LOCATION,
    index,
  };
};

export function setActiveLocation(index) {
  models.realm.write(() => {
    models.realm.create('Options', { key: 1, locationIndex: index }, true);
  });
  return (dispatch) => {
    dispatch(setLocationSettings(index));
  };
}

// Fetch All Locations
const fetchAllLocations = () => {
  return {
    type: types.FETCH_LOCATIONS,
  };
};

const fetchAllLocationsSuccess = (locs) => {
  return {
    type: types.FETCH_LOCATIONS_SUCCESS,
    locations: locs,
  };
};

const fetchAllLocationsFailure = (err) => {
  return {
    type: types.FETCH_LOCATIONS_FAILURE,
    err,
  };
};

export const updateAllStoredLocations = () => {
  const allLocations = getStoredLocations();
  const locationsToUpdate = [];
  allLocations.map((loc) => {
    locationsToUpdate.push(forecastRequest(loc.lat, loc.lng));
  });
  const updatedLocations = [];
  return (dispatch) => {
    dispatch(fetchAllLocations());
    Promise.all(locationsToUpdate).then((response) => {
      response.forEach((forecast) => {
        const lat = forecast.data.latitude;
        const lng = forecast.data.longitude;
        allLocations.forEach((res) => {
          const name = res.name;
          if (lat === res.lat && lng === res.lng) {
            const location = { name, lat, lng };
            const extendedLocation = forecastResponseExtended(location, forecast, res.id);
            writeLocationToStore(extendedLocation, res.id);
            updatedLocations.push(extendedLocation);
            if (updatedLocations.length === allLocations.length) {
              dispatch(fetchAllLocationsSuccess(updatedLocations));
            }
          }
        });
      });
    }).catch((err) => {
      dispatch(fetchAllLocationsFailure(err.response.data.statusText));
    });
  };
};

// Get Locations (stored)
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

export function getLocationsFromStore() {
  const locs = getStoredLocations();
  return (dispatch) => {
    dispatch(getLocation(locs));
  };
}

// Add Index Location (current lat/lng)
const addIndex = (location) => {
  return {
    type: types.ADD_INDEX_LOCATION,
    location,
  };
};

// Add Location
const addLocation = (location) => {
  return {
    type: types.ADD_LOCATION,
    location,
  };
};

const locationLoading = () => {
  return {
    type: types.LOCATION_LOADING,
  };
};

const locationError = (err, type) => {
  return {
    type,
    err,
  };
};

export function addLocationToStore(name, lat, lng, primary = false, id, index) {
  const locs = getStoredLocations();
  const location = {
    name,
    lat,
    lng,
  };

  let locationCheck = true;
  if (!primary) {
    locationCheck = checkLocationExists(locs, name);
  }

  return (dispatch) => {
    dispatch(locationLoading());
    forecastRequest(lat, lng).then((res) => {
      const extendedLocation = forecastResponseExtended(location, res, id);

      if (primary) {
        writeLocationToStore(extendedLocation, 0);
        dispatch(addIndex(extendedLocation));
        dispatch(getLocationsFromStore());
      } else if (typeof id === 'number' && index) {
        writeLocationToStore(extendedLocation, id);
        dispatch(setLocation(index, extendedLocation));
      } else if (locs.length < 5 && !locationCheck) {
        writeLocationToStore(extendedLocation, id);
        dispatch(addLocation(extendedLocation));
        dispatch(setLocationSettings(locs.length));
      } else if (locs.length < 5 && locationCheck) {
        dispatch(locationError('Location already added', types.ADD_LOCATION_ERROR));
      } else {
        dispatch(locationError('Maximum number of locations reached', types.ADD_LOCATION_ERROR));
      }
    }).catch((err) => {
      console.log(err);
      dispatch(locationError(err.response.data.statusText, types.ADD_LOCATION_ERROR));
    });
  };
}

// Remove location
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
