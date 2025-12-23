// This file uses Firebase Firestore with AsyncStorage fallback
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initDatabase,
  addWaterIntake as dbAddWaterIntake,
  getTodayWaterData as dbGetTodayWaterData,
  resetDailyWater as dbResetDailyWater,
  updateDailyGoal as dbUpdateDailyGoal,
  saveReminderSettings as dbSaveReminderSettings,
  loadReminderSettings as dbLoadReminderSettings,
} from './database';

const WATER_DATA_KEY = '@water_data';
const REMINDER_SETTINGS_KEY = '@reminder_settings';

// Track if Firestore is available - start as false, will be tested
let firestoreAvailable = false;
let firestoreTested = false;

// Initialize database on first import (non-blocking)
let dbInitialized = false;
const ensureDatabaseInitialized = async () => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      console.warn('Database initialization failed, using AsyncStorage only:', error);
      dbInitialized = true; // Mark as initialized to prevent retries
    }
  }
};

// Test Firestore availability (non-blocking, runs in background)
const testFirestoreAvailability = async () => {
  if (firestoreTested) return;
  firestoreTested = true;
  
  try {
    await ensureDatabaseInitialized();
    // Try a simple read operation with timeout
    const testPromise = dbGetTodayWaterData();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 2000)
    );
    
    await Promise.race([testPromise, timeoutPromise]);
    firestoreAvailable = true;
    console.log('Firestore is available');
  } catch (error) {
    firestoreAvailable = false;
    console.warn('Firestore not available, using AsyncStorage:', error.message);
  }
};

// Start testing Firestore in background (non-blocking)
testFirestoreAvailability();

// Fallback to AsyncStorage functions
const loadWaterDataFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(WATER_DATA_KEY);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
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
    return {
      today: 0,
      goal: 2000,
      history: [],
      lastDate: new Date().toDateString(),
    };
  }
};

const saveWaterDataToStorage = async (data) => {
  try {
    const dataToSave = {
      ...data,
      lastDate: data.lastDate || new Date().toDateString(),
    };
    const jsonValue = JSON.stringify(dataToSave);
    await AsyncStorage.setItem(WATER_DATA_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving to AsyncStorage:', e);
  }
};

// Water Data Functions
export const saveWaterData = async (data) => {
  try {
    await ensureDatabaseInitialized();
    // This function is kept for compatibility but now uses database
    // The actual saving happens through addWaterIntake and updateDailyGoal
    return { success: true };
  } catch (e) {
    console.error('Error saving water data:', e);
    return { success: false, error: e };
  }
};

export const loadWaterData = async () => {
  // Always start with AsyncStorage for immediate response
  try {
    const localData = await loadWaterDataFromStorage();
    
    // Try Firestore in background if available (non-blocking)
    if (firestoreAvailable && firestoreTested) {
      try {
        const firestoreData = await Promise.race([
          dbGetTodayWaterData(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ]);
        
        // If Firestore succeeds, use that data and sync to local
        if (firestoreData) {
          await saveWaterDataToStorage(firestoreData);
          return firestoreData;
        }
      } catch (error) {
        // Firestore failed, mark as unavailable
        if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
          firestoreAvailable = false;
          console.warn('Firestore permission denied, using AsyncStorage. Make sure you are logged in and rules allow access.');
          console.warn('Error details:', error.code, error.message);
        } else if (error.code === 'unavailable' || error.message?.includes('offline') || error.message === 'timeout') {
          firestoreAvailable = false;
          console.warn('Firestore unavailable, using AsyncStorage');
        } else {
          // Log other errors for debugging
          console.warn('Firestore error:', error.code, error.message);
          firestoreAvailable = false;
        }
      }
    }
    
    // Return local data (either from AsyncStorage or as fallback)
    return localData;
  } catch (e) {
    console.error('Error loading water data:', e);
    // Final fallback
    return {
      today: 0,
      goal: 2000,
      history: [],
      lastDate: new Date().toDateString(),
    };
  }
};

// Add water intake (new function for database)
export const addWaterIntake = async (amount) => {
  try {
    // Always save to AsyncStorage first for immediate response
    const currentData = await loadWaterDataFromStorage();
    const newData = {
      ...currentData,
      today: currentData.today + amount,
      history: [
        ...currentData.history,
        { amount, timestamp: new Date().toISOString() }
      ],
    };
    await saveWaterDataToStorage(newData);
    
    // Try Firestore in background (non-blocking)
    if (firestoreAvailable && firestoreTested) {
      try {
        await Promise.race([
          dbAddWaterIntake(amount),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
      } catch (error) {
        if (error.code === 'unavailable' || error.message?.includes('offline') || error.message === 'timeout') {
          firestoreAvailable = false;
          console.warn('Firestore unavailable, data saved locally only');
        }
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error('Error adding water intake:', e);
    return { success: false, error: e };
  }
};

// Reset daily water (new function for database)
export const resetDailyWater = async () => {
  try {
    // Always reset in AsyncStorage first
    const today = new Date().toDateString();
    const resetData = {
      today: 0,
      goal: 2000,
      history: [],
      lastDate: today,
    };
    await saveWaterDataToStorage(resetData);
    
    // Try Firestore in background (non-blocking)
    if (firestoreAvailable && firestoreTested) {
      try {
        await Promise.race([
          dbResetDailyWater(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
      } catch (error) {
        if (error.code === 'unavailable' || error.message?.includes('offline') || error.message === 'timeout') {
          firestoreAvailable = false;
        }
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error('Error resetting daily water:', e);
    return { success: false, error: e };
  }
};

// Update goal (new function for database)
export const updateGoal = async (goal) => {
  try {
    // Always update AsyncStorage first
    const currentData = await loadWaterDataFromStorage();
    const updatedData = {
      ...currentData,
      goal: goal,
    };
    await saveWaterDataToStorage(updatedData);
    
    // Try Firestore in background (non-blocking)
    if (firestoreAvailable && firestoreTested) {
      try {
        await Promise.race([
          dbUpdateDailyGoal(goal),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
      } catch (error) {
        if (error.code === 'unavailable' || error.message?.includes('offline') || error.message === 'timeout') {
          firestoreAvailable = false;
        }
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error('Error updating goal:', e);
    return { success: false, error: e };
  }
};

// Reminder Settings Functions
const loadReminderSettingsFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      enabled: true,
      interval: 60,
      startTime: '08:00',
      endTime: '22:00',
      customAmount: 250,
    };
  } catch (e) {
    return {
      enabled: true,
      interval: 60,
      startTime: '08:00',
      endTime: '22:00',
      customAmount: 250,
    };
  }
};

const saveReminderSettingsToStorage = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving reminder settings to AsyncStorage:', e);
  }
};

export const saveReminderSettings = async (settings) => {
  try {
    // Always save to AsyncStorage first
    await saveReminderSettingsToStorage(settings);
    
    // Try Firestore in background (non-blocking)
    if (firestoreAvailable && firestoreTested) {
      try {
        await Promise.race([
          dbSaveReminderSettings(settings),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
      } catch (error) {
        if (error.code === 'unavailable' || error.message?.includes('offline') || error.message === 'timeout') {
          firestoreAvailable = false;
        }
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error('Error saving reminder settings:', e);
    return { success: false, error: e };
  }
};

export const loadReminderSettings = async () => {
  try {
    // Always load from AsyncStorage first
    const localSettings = await loadReminderSettingsFromStorage();
    
    // Try Firestore in background if available (non-blocking)
    if (firestoreAvailable && firestoreTested) {
      try {
        const firestoreSettings = await Promise.race([
          dbLoadReminderSettings(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ]);
        
        if (firestoreSettings) {
          await saveReminderSettingsToStorage(firestoreSettings);
          return firestoreSettings;
        }
      } catch (error) {
        if (error.code === 'unavailable' || error.message?.includes('offline') || error.message === 'timeout') {
          firestoreAvailable = false;
        }
      }
    }
    
    return localSettings;
  } catch (e) {
    console.error('Error loading reminder settings:', e);
    return {
      enabled: true,
      interval: 60,
      startTime: '08:00',
      endTime: '22:00',
      customAmount: 250,
    };
  }
};


