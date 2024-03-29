import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORE_KEY } from '../config';
import moment from 'moment';

const storeLocation = async (location: Location) => {
  try {
    const jsonValue = JSON.stringify(location);
    await AsyncStorage.setItem(STORE_KEY, jsonValue);
  } catch (e) {
    // saving error
  }
};

const getLocation = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORE_KEY);
    return jsonValue != null ? (JSON.parse(jsonValue) as Location) : null;
  } catch (e) {
    // error reading value
  }
};
const storageHelper = {
  storeLocation,
  getLocation,
};

const getDateLabel = (epochTimeStamp: number) => {
  const today = moment().startOf('day');
  const tomorrow = moment().add(1, 'days').startOf('day');

  const date = moment.unix(epochTimeStamp);

  if (date.isSame(today, 'day')) {
    return 'Today';
  } else if (date.isSame(tomorrow, 'day')) {
    return 'Tomorrow';
  } else {
    return date.format('ddd');
  }
};

const dateHelper = {
  getDateLabel,
};

export default {
  storageHelper,
  dateHelper,
};
