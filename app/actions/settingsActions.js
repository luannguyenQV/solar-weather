import * as types from './actionTypes';
import models from '../realm/models';

const updateTimeReducer = (timeType, index) => {
  return {
    type: types.SET_TIME_TYPE,
    timeType,
    timeIndex: index,
  };
};

export function setTimeType(timeType, index) {
  models.realm.write(() => {
    models.realm.create('Options', { key: 1, timeType, timeIndex: index }, true);
  });
  return (dispatch) => {
    dispatch(updateTimeReducer(timeType, index));
  };
}

export function setUnit(unit, index) {
  models.realm.write(() => {
    models.realm.create('Options', { key: 1, unit, unitIndex: index }, true);
  });
  return (dispatch) => {
    dispatch({
      type: types.SET_UNIT,
      unit,
      unitIndex: index,
    });
  };
}

export function getSettings() {
  const settings = models.realm.objects('Options').slice(0, 1)[0];
  const unit = settings ? settings.unit : 'c';
  const unitIndex = settings ? settings.unitIndex : 0;
  const timeType = settings ? settings.timeType : '24';
  const timeIndex = settings ? settings.timeIndex : 0;
  const locationIndex = settings ? settings.locationIndex : 0;
  if (!settings) {
    models.realm.write(() => {
      models.realm.create('Options', { unit: 'c', unitIndex: 0, timeType: '24', timeIndex: 0, key: 1 });
    });
  }
  return (dispatch) => {
    dispatch({
      type: types.SET_SETTINGS,
      unit,
      unitIndex,
      timeType,
      timeIndex,
      locationIndex,
    });
  };
}
