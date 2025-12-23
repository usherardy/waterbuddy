import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, AppState, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './src/screens/MainScreen';
import ReminderSettingsScreen from './src/screens/ReminderSettingsScreen';
import AuthScreen from './src/screens/AuthScreen';
import { 
  loadWaterData, 
  addWaterIntake, 
  resetDailyWater, 
  updateGoal as updateDailyGoal 
} from './src/utils/storage';
import { initializeNotifications, scheduleReminders } from './src/utils/notifications';
import { registerUser, signInUser, onAuthStateChange, signOutUser } from './src/utils/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('main');
  const [waterData, setWaterData] = useState({
    today: 0,
    goal: 2000, // 2 liters in ml
    history: []
  });

  const loadData = () => {
    loadWaterData().then(data => {
      if (data) {
        setWaterData(data);
      }
    });
  };

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribeAuth = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // User is signed in, wait a moment for auth token to propagate, then load data
        setTimeout(() => {
          loadData();
        }, 500);
      }
    });

    // Initialize notifications
    initializeNotifications();

    // Listen for app state changes to check for daily reset
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && user) {
        loadData(); // Reload data when app comes to foreground
      }
    });

    return () => {
      unsubscribeAuth();
      subscription?.remove();
    };
  }, [user]);

  const addWater = async (amount) => {
    const result = await addWaterIntake(amount);
    if (result.success) {
      // Reload data from database
      loadData();
    }
  };

  const resetDaily = async () => {
    const result = await resetDailyWater();
    if (result.success) {
      // Reload data from database
      loadData();
    }
  };

  const updateGoal = async (newGoal) => {
    const result = await updateDailyGoal(newGoal);
    if (result.success) {
      // Reload data from database
      loadData();
    }
  };

  const updateReminderSettings = async (settings) => {
    await scheduleReminders(settings);
  };

  const handleLogin = async (email, password) => {
    return await signInUser(email, password);
  };

  const handleRegister = async (email, password) => {
    return await registerUser(email, password);
  };

  const handleLogout = async () => {
    await signOutUser();
    setWaterData({
      today: 0,
      goal: 2000,
      history: []
    });
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        </SafeAreaView>
      </PaperProvider>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
          <AuthScreen
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  // Show main app if logged in
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
        {currentScreen === 'main' ? (
          <MainScreen
            waterData={waterData}
            addWater={addWater}
            resetDaily={resetDaily}
            updateGoal={updateGoal}
            onSettingsPress={() => setCurrentScreen('settings')}
            onLogout={handleLogout}
          />
        ) : (
          <ReminderSettingsScreen
            onBack={() => setCurrentScreen('main')}
            onSave={updateReminderSettings}
          />
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

