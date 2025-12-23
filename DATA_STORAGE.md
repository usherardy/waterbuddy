# What Data Does This App Store?

## Overview
The Water Reminder App stores data in **Firebase Firestore** (NOT Realtime Database). Each user's data is stored separately using their unique user ID.

## Data Collections

### 1. `water_intake` Collection
**Purpose:** Stores every time a user drinks water

**Example Document:**
```javascript
Document ID: "abc123user_Mon Dec 23 2024_1703347200000"
{
  userId: "abc123user",           // Firebase Auth user ID
  amount: 250,                     // Amount in ml
  timestamp: Timestamp,            // When they drank
  date: "Mon Dec 23 2024",        // Date string
  createdAt: Timestamp            // When record was created
}
```

**When it's created:** Every time user taps a water intake button (100ml, 200ml, 250ml, 500ml)

---

### 2. `daily_stats` Collection
**Purpose:** Stores daily totals and goals for each user

**Example Document:**
```javascript
Document ID: "abc123user_Mon Dec 23 2024"
{
  userId: "abc123user",           // Firebase Auth user ID
  date: "Mon Dec 23 2024",        // Date string
  total_amount: 1250,             // Total water consumed today (ml)
  goal: 2000,                      // Daily goal (ml)
  last_updated: Timestamp,         // Last update time
  createdAt: Timestamp            // When record was created
}
```

**When it's created/updated:** 
- Created when user first drinks water that day
- Updated every time user adds water
- Updated when user changes their goal

---

### 3. `reminder_settings` Collection
**Purpose:** Stores reminder preferences for each user

**Example Document:**
```javascript
Document ID: "abc123user"
{
  userId: "abc123user",           // Firebase Auth user ID
  enabled: true,                   // Are reminders on?
  interval: 60,                    // Reminder every 60 minutes
  start_time: "08:00",            // Start time
  end_time: "22:00",              // End time
  custom_amount: 250,             // Reminder amount (ml)
  last_updated: Timestamp         // Last update time
}
```

**When it's created/updated:** When user saves reminder settings

---

## Where to View Your Data

### In Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **waterbuddy-11f7f**
3. Click **"Firestore Database"** in the left sidebar (NOT "Realtime Database")
4. You'll see three collections:
   - `water_intake`
   - `daily_stats`
   - `reminder_settings`

### Example Data Structure:
```
Firestore Database
├── water_intake/
│   ├── abc123user_Mon Dec 23 2024_1703347200000
│   ├── abc123user_Mon Dec 23 2024_1703350800000
│   └── ...
├── daily_stats/
│   ├── abc123user_Mon Dec 23 2024
│   ├── abc123user_Tue Dec 24 2024
│   └── ...
└── reminder_settings/
    └── abc123user
```

---

## Important Notes

### ✅ We Use: Firestore Database
- Go to: Firebase Console → **Firestore Database**
- URL pattern: `https://console.firebase.google.com/project/waterbuddy-11f7f/firestore`

### ❌ We DON'T Use: Realtime Database
- The link you shared (`https://waterbuddy-11f7f-default-rtdb.firebaseio.com/`) is for Realtime Database
- The app doesn't use this - you can ignore it or delete it

---

## Data Privacy & Security

- Each user can only see their own data (based on their `userId`)
- Data is stored securely in Firebase
- Users must be authenticated to access their data
- All data is associated with the user's Firebase Auth UID

---

## Data Size Estimate

For a typical user:
- **water_intake**: ~10-20 documents per day (if they drink 10-20 times)
- **daily_stats**: 1 document per day
- **reminder_settings**: 1 document per user (total)

**Total storage per user per month:** Very minimal (a few KB)

---

## How to Check Your Data

1. **In the App:**
   - All data is displayed in the app UI
   - Water bottle shows current progress
   - Stats card shows consumed/goal/remaining

2. **In Firebase Console:**
   - Go to Firestore Database
   - Click on any collection
   - View individual documents
   - See all fields and values

---

## Need to Delete Data?

You can delete data in Firebase Console:
1. Go to Firestore Database
2. Click on a collection
3. Click on a document
4. Click "Delete document"

Or delete entire collections (be careful!)

