# How to See Data in Firestore

## Why You Don't See Collections Yet

**Collections are created automatically** when your app first writes data to Firestore. If you don't see any collections, it means:
- The app hasn't written any data yet, OR
- There's an error preventing data from being saved

## Steps to Create Data (and See Collections)

### Step 1: Make Sure Authentication is Enabled
1. Go to Firebase Console → **Authentication**
2. Click **"Sign-in method"** tab
3. Enable **"Email/Password"** if not already enabled

### Step 2: Register/Login in the App
1. Open your app
2. Register a new account (or login if you already have one)
3. You should see the main screen with the water bottle

### Step 3: Add Water Intake
1. Tap any water intake button (100ml, 200ml, 250ml, or 500ml)
2. This should create data in Firestore

### Step 4: Check Firestore Database
1. Go to Firebase Console → **Firestore Database**
2. You should now see collections appear:
   - `water_intake` - appears when you add water
   - `daily_stats` - appears when you add water
   - `reminder_settings` - appears when you save reminder settings

## Troubleshooting

### If Collections Still Don't Appear:

#### 1. Check for Errors
- Look at your app console/terminal for error messages
- Common errors:
  - "Permission denied" - Check Firestore security rules
  - "Offline" - Check internet connection
  - "Configuration not found" - Check Firebase config

#### 2. Check Firestore Security Rules
Go to Firestore Database → **Rules** tab and make sure you have:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Or for testing (less secure):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### 3. Verify You're Looking at the Right Database
- Make sure you're in **Firestore Database** (not Realtime Database)
- Make sure you selected the correct project: **waterbuddy-11f7f**

#### 4. Check App is Connected
- Make sure you're logged in (authenticated)
- Check that the app shows the main screen (not login screen)
- Try adding water again

## What You Should See

Once data is created, you'll see:

### Collection: `water_intake`
```
water_intake/
  └── {userId}_{date}_{timestamp}/
      ├── userId: "abc123..."
      ├── amount: 250
      ├── timestamp: [Timestamp]
      ├── date: "Mon Dec 23 2024"
      └── createdAt: [Timestamp]
```

### Collection: `daily_stats`
```
daily_stats/
  └── {userId}_{date}/
      ├── userId: "abc123..."
      ├── date: "Mon Dec 23 2024"
      ├── total_amount: 250
      ├── goal: 2000
      ├── last_updated: [Timestamp]
      └── createdAt: [Timestamp]
```

### Collection: `reminder_settings`
```
reminder_settings/
  └── {userId}/
      ├── userId: "abc123..."
      ├── enabled: true
      ├── interval: 60
      ├── start_time: "08:00"
      ├── end_time: "22:00"
      ├── custom_amount: 250
      └── last_updated: [Timestamp]
```

## Quick Test

1. **Register/Login** in the app
2. **Add water** (tap 250ml button)
3. **Go to Firestore** → You should see `water_intake` and `daily_stats` collections
4. **Go to Settings** → Save reminder settings
5. **Go to Firestore** → You should see `reminder_settings` collection

## Still Not Working?

Check the browser/device console for errors. Common issues:
- Firestore not enabled
- Security rules blocking writes
- Not authenticated
- Network issues
- Firebase config incorrect

