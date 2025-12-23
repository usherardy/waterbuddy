import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
  deleteDoc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

// Collection names
const COLLECTIONS = {
  WATER_INTAKE: 'water_intake',
  DAILY_STATS: 'daily_stats',
  REMINDER_SETTINGS: 'reminder_settings',
};

// Initialize database (Firestore doesn't need explicit initialization)
export const initDatabase = async () => {
  try {
    console.log('Firebase Firestore initialized');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
};

// Helper function to get today's date string
const getTodayDateString = () => {
  return new Date().toDateString();
};

// Helper function to get user ID from Firebase Auth
const getUserId = () => {
  // Get current user from Firebase Auth
  const user = auth.currentUser;
  if (user && user.uid) {
    return user.uid;
  }
  
  // Fallback to default user if not authenticated
  return 'default_user';
};

// Water Intake Functions
export const addWaterIntake = async (amount) => {
  try {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      console.warn('User not authenticated, cannot add water intake to Firestore');
      return { success: false, error: 'User not authenticated' };
    }

    const userId = getUserId();
    const now = new Date();
    const timestamp = Timestamp.now();
    const date = getTodayDateString();

    // Create a unique ID for the intake record
    const intakeId = `${userId}_${date}_${timestamp.toMillis()}`;
    
    // Add water intake record
    await setDoc(
      doc(db, COLLECTIONS.WATER_INTAKE, intakeId),
      {
        userId,
        amount,
        timestamp,
        date,
        createdAt: serverTimestamp(),
      }
    );

    // Update or create daily stats
    const statsDocRef = doc(db, COLLECTIONS.DAILY_STATS, `${userId}_${date}`);
    const statsDoc = await getDoc(statsDocRef);

    if (statsDoc.exists()) {
      // Update existing stats
      await updateDoc(statsDocRef, {
        total_amount: increment(amount),
        last_updated: serverTimestamp(),
      });
    } else {
      // Create new stats document
      await setDoc(statsDocRef, {
        userId,
        date,
        total_amount: amount,
        goal: 2000,
        last_updated: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }

    return { success: true };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
      console.error('Permission denied - check Firestore rules and authentication:', error.message);
      return { success: false, error: 'Permission denied. Please check you are logged in.' };
    }
    console.error('Error adding water intake:', error);
    return { success: false, error };
  }
};

export const getTodayWaterData = async () => {
  try {
    // Check if user is authenticated before accessing Firestore
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      console.warn('User not authenticated, returning default data');
      return {
        today: 0,
        goal: 2000,
        history: [],
        lastDate: getTodayDateString(),
      };
    }

    const userId = getUserId();
    const today = getTodayDateString();
    const statsDocId = `${userId}_${today}`;

    // Get today's stats
    const statsDocRef = doc(db, COLLECTIONS.DAILY_STATS, statsDocId);
    const statsDoc = await getDoc(statsDocRef);

    // Get today's intake history
    // Note: This query requires a composite index in Firestore
    // If you get an error, Firebase will provide a link to create the index
    let intakeSnapshot;
    try {
      const intakeQuery = query(
        collection(db, COLLECTIONS.WATER_INTAKE),
        where('userId', '==', userId),
        where('date', '==', today),
        orderBy('timestamp', 'desc')
      );
      intakeSnapshot = await getDocs(intakeQuery);
    } catch (indexError) {
      // If index error, try without orderBy
      if (indexError.code === 'failed-precondition') {
        console.warn('Firestore index needed. Creating query without orderBy...');
        const intakeQuery = query(
          collection(db, COLLECTIONS.WATER_INTAKE),
          where('userId', '==', userId),
          where('date', '==', today)
        );
        intakeSnapshot = await getDocs(intakeQuery);
        // Sort in memory
        intakeSnapshot.docs.sort((a, b) => {
          const aTime = a.data().timestamp?.toMillis?.() || 0;
          const bTime = b.data().timestamp?.toMillis?.() || 0;
          return bTime - aTime; // Descending
        });
      } else {
        throw indexError;
      }
    }
    const history = intakeSnapshot.docs.map(doc => ({
      id: doc.id,
      amount: doc.data().amount,
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp,
    }));

    if (statsDoc.exists()) {
      const statsData = statsDoc.data();
      return {
        today: statsData.total_amount || 0,
        goal: statsData.goal || 2000,
        history,
        lastDate: today,
      };
    }

    // Return default if no stats found
    return {
      today: 0,
      goal: 2000,
      history: [],
      lastDate: today,
    };
  } catch (error) {
    // Check if it's a permissions error
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
      console.warn('Firestore permission denied - user may not be authenticated:', error.message);
      return {
        today: 0,
        goal: 2000,
        history: [],
        lastDate: getTodayDateString(),
      };
    }
    
    // Check if it's an offline error
    if (error.code === 'unavailable' || error.message?.includes('offline')) {
      console.warn('Firestore is offline, using fallback data');
      return {
        today: 0,
        goal: 2000,
        history: [],
        lastDate: getTodayDateString(),
      };
    }
    
    console.error('Error getting today water data:', error);
    return {
      today: 0,
      goal: 2000,
      history: [],
      lastDate: getTodayDateString(),
    };
  }
};

export const resetDailyWater = async () => {
  try {
    const userId = getUserId();
    const today = getTodayDateString();

    // Delete all today's intake records
    const intakeQuery = query(
      collection(db, COLLECTIONS.WATER_INTAKE),
      where('userId', '==', userId),
      where('date', '==', today)
    );

    const intakeSnapshot = await getDocs(intakeQuery);
    const deletePromises = intakeSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Reset today's stats
    const statsDocRef = doc(db, COLLECTIONS.DAILY_STATS, `${userId}_${today}`);
    const statsDoc = await getDoc(statsDocRef);

    if (statsDoc.exists()) {
      await updateDoc(statsDocRef, {
        total_amount: 0,
        last_updated: serverTimestamp(),
      });
    } else {
      await setDoc(statsDocRef, {
        userId,
        date: today,
        total_amount: 0,
        goal: 2000,
        last_updated: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error resetting daily water:', error);
    return { success: false, error };
  }
};

export const updateDailyGoal = async (goal) => {
  try {
    const userId = getUserId();
    const today = getTodayDateString();
    const statsDocRef = doc(db, COLLECTIONS.DAILY_STATS, `${userId}_${today}`);
    const statsDoc = await getDoc(statsDocRef);

    if (statsDoc.exists()) {
      await updateDoc(statsDocRef, {
        goal,
        last_updated: serverTimestamp(),
      });
    } else {
      await setDoc(statsDocRef, {
        userId,
        date: today,
        total_amount: 0,
        goal,
        last_updated: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating daily goal:', error);
    return { success: false, error };
  }
};

// Reminder Settings Functions
export const saveReminderSettings = async (settings) => {
  try {
    const userId = getUserId();
    const settingsDocRef = doc(db, COLLECTIONS.REMINDER_SETTINGS, userId);

    await setDoc(
      settingsDocRef,
      {
        userId,
        enabled: settings.enabled || false,
        interval: settings.interval || 60,
        start_time: settings.startTime || '08:00',
        end_time: settings.endTime || '22:00',
        custom_amount: settings.customAmount || 250,
        last_updated: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error saving reminder settings:', error);
    return { success: false, error };
  }
};

export const loadReminderSettings = async () => {
  try {
    const userId = getUserId();
    const settingsDocRef = doc(db, COLLECTIONS.REMINDER_SETTINGS, userId);
    const settingsDoc = await getDoc(settingsDocRef);

    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return {
        enabled: data.enabled !== undefined ? data.enabled : true,
        interval: data.interval || 60,
        startTime: data.start_time || '08:00',
        endTime: data.end_time || '22:00',
        customAmount: data.custom_amount || 250,
      };
    }

    // Return default settings
    return {
      enabled: true,
      interval: 60,
      startTime: '08:00',
      endTime: '22:00',
      customAmount: 250,
    };
  } catch (error) {
    console.error('Error loading reminder settings:', error);
    return {
      enabled: true,
      interval: 60,
      startTime: '08:00',
      endTime: '22:00',
      customAmount: 250,
    };
  }
};

// History Functions
export const getWaterHistory = async (days = 7) => {
  try {
    const userId = getUserId();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateString = cutoffDate.toDateString();

    const statsQuery = query(
      collection(db, COLLECTIONS.DAILY_STATS),
      where('userId', '==', userId),
      where('date', '>=', cutoffDateString),
      orderBy('date', 'desc')
    );

    const statsSnapshot = await getDocs(statsQuery);
    const history = statsSnapshot.docs.map(doc => ({
      id: doc.id,
      date: doc.data().date,
      total_amount: doc.data().total_amount || 0,
      goal: doc.data().goal || 2000,
    }));

    return history;
  } catch (error) {
    console.error('Error getting water history:', error);
    return [];
  }
};

// Export database instance for advanced queries
export const getDatabaseInstance = async () => {
  return db;
};
