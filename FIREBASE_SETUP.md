# Firebase Firestore Setup Guide

## Overview
The Water Reminder App now uses **Firebase Firestore** for cloud-based data storage. This provides real-time synchronization, cloud backup, and multi-device support.

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (you can name it "Water Reminder App")
5. Copy the Firebase configuration object

### 3. Update Firebase Configuration

Open `src/config/firebase.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // Replace with your API key
  authDomain: "YOUR_AUTH_DOMAIN",            // Replace with your auth domain
  projectId: "YOUR_PROJECT_ID",             // Replace with your project ID
  storageBucket: "YOUR_STORAGE_BUCKET",      // Replace with your storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your sender ID
  appId: "YOUR_APP_ID"                       // Replace with your app ID
};
```

### 4. Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
   - **Note**: For production, set up proper security rules
4. Select a location for your database
5. Click "Enable"

### 5. Set Up Firestore Security Rules (Important!)

Go to **Firestore Database** → **Rules** and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Water intake collection
    match /water_intake/{document=**} {
      allow read, write: if request.auth != null || true; // For development only
    }
    
    // Daily stats collection
    match /daily_stats/{document=**} {
      allow read, write: if request.auth != null || true; // For development only
    }
    
    // Reminder settings collection
    match /reminder_settings/{document=**} {
      allow read, write: if request.auth != null || true; // For development only
    }
  }
}
```

**⚠️ Important**: The rules above allow public access for development. For production, implement proper authentication and security rules.

### 6. Install Dependencies

Run the following command in your project directory:

```bash
npm install
```

This will install the `firebase` package.

## Firestore Collections

The app uses three main collections:

### 1. `water_intake`
Stores individual water intake records.
- Document ID: `{userId}_{date}_{timestamp}`
- Fields: `userId`, `amount`, `timestamp`, `date`, `createdAt`

### 2. `daily_stats`
Stores daily statistics and goals.
- Document ID: `{userId}_{date}`
- Fields: `userId`, `date`, `total_amount`, `goal`, `last_updated`, `createdAt`

### 3. `reminder_settings`
Stores reminder configuration.
- Document ID: `{userId}`
- Fields: `userId`, `enabled`, `interval`, `start_time`, `end_time`, `custom_amount`, `last_updated`

## Features

✅ **Cloud Storage**: Data is stored in the cloud, not just locally  
✅ **Real-time Sync**: Changes sync across devices (can be added with listeners)  
✅ **Backup**: Automatic cloud backup  
✅ **Scalable**: Handles large amounts of data  
✅ **Multi-device**: Access your data from any device  

## Testing

After setup, test the app:
1. Add water intake - should save to Firestore
2. Check Firebase Console → Firestore Database to see the data
3. Reset water - should update in Firestore
4. Change settings - should save to Firestore

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
- Make sure you've updated `src/config/firebase.js` with your Firebase config

### Error: "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure Firestore is enabled in Firebase Console

### Data not appearing
- Check Firebase Console → Firestore Database
- Verify your Firebase config is correct
- Check browser/device console for errors

## Next Steps (Optional)

1. **Add Authentication**: Implement Firebase Auth for user login
2. **Real-time Listeners**: Add real-time updates using `onSnapshot`
3. **Offline Support**: Enable offline persistence
4. **Analytics**: Add Firebase Analytics for usage tracking

## Security Best Practices

For production:
1. Implement Firebase Authentication
2. Update security rules to require authentication
3. Add field validation in security rules
4. Set up proper indexes for queries
5. Enable App Check for additional security

