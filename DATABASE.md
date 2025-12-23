# Database Documentation

## Overview
The Water Reminder App uses **Firebase Firestore** for cloud-based data storage. This provides real-time synchronization, cloud backup, and multi-device support.

## Database Structure

### Collections

#### 1. `water_intake` Collection
Stores individual water intake records.

**Document Structure:**
```javascript
{
  userId: string,        // User identifier
  amount: number,         // Amount of water in ml
  timestamp: Timestamp,   // Firestore timestamp
  date: string,           // Date string (for daily grouping)
  createdAt: Timestamp   // Creation timestamp
}
```

**Document ID Format:** `{userId}_{date}_{timestamp}`

#### 2. `daily_stats` Collection
Stores daily statistics and goals.

**Document Structure:**
```javascript
{
  userId: string,         // User identifier
  date: string,           // Date string (unique per user)
  total_amount: number,   // Total water consumed (ml)
  goal: number,           // Daily goal (ml), default 2000
  last_updated: Timestamp, // Last update timestamp
  createdAt: Timestamp    // Creation timestamp
}
```

**Document ID Format:** `{userId}_{date}`

#### 3. `reminder_settings` Collection
Stores reminder configuration.

**Document Structure:**
```javascript
{
  userId: string,         // User identifier
  enabled: boolean,        // Reminder enabled/disabled
  interval: number,        // Reminder interval in minutes
  start_time: string,      // Start time (HH:MM format)
  end_time: string,        // End time (HH:MM format)
  custom_amount: number,   // Reminder amount in ml
  last_updated: Timestamp  // Last update timestamp
}
```

**Document ID Format:** `{userId}`

## Database Functions

### Initialization
- `initDatabase()` - Initializes Firebase Firestore connection

### Water Intake
- `addWaterIntake(amount)` - Adds a water intake record and updates daily stats
- `getTodayWaterData()` - Retrieves today's water data and history
- `resetDailyWater()` - Resets today's water intake
- `updateDailyGoal(goal)` - Updates the daily water goal

### Reminder Settings
- `saveReminderSettings(settings)` - Saves reminder configuration
- `loadReminderSettings()` - Loads reminder configuration

### History
- `getWaterHistory(days)` - Gets water intake history for the last N days

## Benefits of Firestore

1. **Cloud Storage**: Data is stored in the cloud, accessible from anywhere
2. **Real-time Sync**: Can sync data across devices in real-time
3. **Automatic Backup**: Cloud-based backup ensures data safety
4. **Scalability**: Handles large amounts of data efficiently
5. **Offline Support**: Can work offline and sync when online (can be enabled)
6. **Multi-device**: Access your data from any device
7. **Security**: Built-in security rules for data access control

## Configuration

Firebase configuration is stored in `src/config/firebase.js`. You need to:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Get your Firebase configuration
3. Update `src/config/firebase.js` with your config values
4. Set up Firestore database in Firebase Console
5. Configure security rules

See `FIREBASE_SETUP.md` for detailed setup instructions.

## Security

Currently using a default user ID (`'default_user'`). For production:
- Implement Firebase Authentication
- Use authenticated user IDs
- Update security rules to require authentication
- Add proper field validation

## Future Enhancements

- Real-time listeners for live updates
- Offline persistence
- Multi-user support with authentication
- Data export functionality
- Analytics integration
- Cloud functions for advanced features
