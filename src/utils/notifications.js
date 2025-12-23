import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const initializeNotifications = async () => {
  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permissions not granted');
    return false;
  }

  // Configure notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('water-reminders', {
      name: 'Water Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4A90E2',
      sound: 'default',
    });
  }

  return true;
};

export const scheduleReminders = async (settings) => {
  if (!settings || !settings.enabled) {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }

  // Cancel existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  const interval = settings.interval || 60; // minutes
  const startTime = settings.startTime || '08:00';
  const endTime = settings.endTime || '22:00';
  const amount = settings.customAmount || 250;

  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // Calculate number of reminders per day
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const totalMinutes = endMinutes - startMinutes;
  const numReminders = Math.floor(totalMinutes / interval);

  // Schedule recurring daily notifications
  for (let i = 0; i < numReminders; i++) {
    const reminderMinutes = startMinutes + (i * interval);
    const reminderHour = Math.floor(reminderMinutes / 60);
    const reminderMinute = reminderMinutes % 60;

    // Skip if reminder time is after end time
    if (reminderMinutes >= endMinutes) {
      break;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Time to Hydrate!',
        body: `Remember to drink ${amount}ml of water. Stay healthy!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { amount },
        channelId: 'water-reminders',
      },
      trigger: {
        hour: reminderHour,
        minute: reminderMinute,
        repeats: true,
      },
    });
  }
};

export const sendTestNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💧 Water Reminder Test',
      body: 'This is a test notification!',
      sound: true,
    },
    trigger: { seconds: 2 },
  });
};

