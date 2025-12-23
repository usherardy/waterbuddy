import AsyncStorage from '@react-native-async-storage/async-storage';

const WATER_DATA_KEY = '@water_data';
const REMINDER_SETTINGS_KEY = '@reminder_settings';

export const saveWaterData = async (data) => {
  try {
    const dataToSave = {
      ...data,
      lastDate: data.lastDate || new Date().toDateString(),
    };
    const jsonValue = JSON.stringify(dataToSave);
    await AsyncStorage.setItem(WATER_DATA_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving water data:', e);
  }
};

export const loadWaterData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(WATER_DATA_KEY);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      // Check if it's a new day and reset if needed
      const today = new Date().toDateString();
      const lastDate = data.lastDate;
      if (lastDate !== today) {
        return {
          ...data,
          today: 0,
          history: [],
          lastDate: today,
        };
      }
      return { ...data, lastDate: today };
    }
    return {
      today: 0,
      goal: 2000,
      history: [],
      lastDate: new Date().toDateString(),
    };
  } catch (e) {
    console.error('Error loading water data:', e);
    return {
      today: 0,
      goal: 2000,
      history: [],
      lastDate: new Date().toDateString(),
    };
  }
};

export const saveReminderSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving reminder settings:', e);
  }
};

export const loadReminderSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading reminder settings:', e);
    return null;
  }
};

