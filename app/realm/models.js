import Realm from 'realm';

class Data extends Realm.Object {}
Data.schema = {
  name: 'Data',
  properties: {
    time: 'int',
    summary: 'string',
    icon: 'string',
    sunriseTime: 'int',
    sunsetTime: 'int',
    precipIntensity: 'float',
    precipProbability: 'float',
    precipType: { type: 'string', optional: true },
    temperatureMin: 'float',
    temperatureMax: 'float',
    humidity: 'float',
  },
};

class BaseData extends Realm.Object {}
BaseData.schema = {
  name: 'BaseData',
  properties: {
    time: 'int',
    summary: 'string',
    icon: 'string',
    precipIntensity: 'float',
    precipProbability: 'float',
    precipType: { type: 'string', optional: true },
    temperature: 'float',
    humidity: 'float',
  },
};

class Alert extends Realm.Object {}
Alert.schema = {
  name: 'Alert',
  properties: {
    title: 'string',
    time: 'int',
    expires: 'int',
    description: 'string',
    uri: 'string',
  },
};

class Daily extends Realm.Object {}
Daily.schema = {
  name: 'Daily',
  properties: {
    summary: 'string',
    icon: 'string',
    data: { type: 'list', objectType: 'Data' },
  },
};

class Hourly extends Realm.Object {}
Hourly.schema = {
  name: 'Hourly',
  properties: {
    summary: 'string',
    icon: 'string',
    data: { type: 'list', objectType: 'BaseData' },
  },
};

class Currently extends Realm.Object {}
Currently.schema = {
  name: 'Currently',
  properties: {
    summary: 'string',
    icon: 'string',
    precipIntensity: 'float',
    precipProbability: 'float',
    precipType: { type: 'string', optional: true },
    temperature: 'float',
    humidity: 'float',
    apparentTemperature: 'float',
  },
};

class Locations extends Realm.Object {}
Locations.schema = {
  name: 'Location',
  primaryKey: 'id',
  properties: {
    id: 'int',
    timezone: 'string',
    daily: 'Daily',
    name: 'string',
    hourly: 'Hourly',
    currently: 'Currently',
    alerts: { type: 'list', objectType: 'Alert' },
    lat: 'float',
    lng: 'float',
    last_updated: 'date',
    created_at: 'date',
  },
};

class Options extends Realm.Object {}
Options.schema = {
  name: 'Options',
  primaryKey: 'key',
  properties: {
    key: { type: 'int' },
    unit: { type: 'string', default: 'c' },
    unitIndex: { type: 'int', default: 0 },
    timeType: { type: 'string', default: '24' },
    timeIndex: { type: 'int', default: 0 },
    locationIndex: { type: 'int', default: 0 },
  },
};

const realm = new Realm({
  schema: [Locations, Options, Daily, Data, Alert, Hourly, BaseData, Currently],
  schemaVersion: 71,
});

module.exports = {
  realm,
};
