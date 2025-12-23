import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, AppState } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import MainScreen from './src/screens/MainScreen';
import ReminderSettingsScreen from './src/screens/ReminderSettingsScreen';
import { loadWaterData, saveWaterData } from './src/utils/storage';
import { initializeNotifications, scheduleReminders } from './src/utils/notifications';

export default function App() {
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
    // Load saved data
    loadData();

    // Initialize notifications
    initializeNotifications();

    // Listen for app state changes to check for daily reset
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadData(); // Reload data when app comes to foreground
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const addWater = (amount) => {
    const newAmount = waterData.today + amount;
    const newData = {
      ...waterData,
      today: newAmount,
      history: [
        ...waterData.history,
        { amount, timestamp: new Date().toISOString() }
      ],
      lastDate: new Date().toDateString(),
    };
    setWaterData(newData);
    saveWaterData(newData);
  };

  const resetDaily = () => {
    const newData = {
      ...waterData,
      today: 0,
      history: [],
      lastDate: new Date().toDateString(),
    };
    setWaterData(newData);
    saveWaterData(newData);
  };

  const updateGoal = (newGoal) => {
    const newData = {
      ...waterData,
      goal: newGoal
    };
    setWaterData(newData);
    saveWaterData(newData);
  };

  const updateReminderSettings = async (settings) => {
    await scheduleReminders(settings);
  };

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
});

