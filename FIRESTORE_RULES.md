# Firestore Security Rules

## Current Problem
Your rules have `allow read, write: if false;` which blocks ALL data access. This is why no collections appear - the app can't write data!

## Solution: Update Your Rules

### Option 1: For Development/Testing (Less Secure)
Allows all authenticated users to read/write:

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

### Option 2: For Production (More Secure)
Users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Water intake - users can only access their own records
    match /water_intake/{documentId} {
      allow read, write: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
    }
    
    // Daily stats - users can only access their own stats
    match /daily_stats/{documentId} {
      allow read, write: if request.auth != null 
        && (request.resource.data.userId == request.auth.uid 
            || resource.data.userId == request.auth.uid);
    }
    
    // Reminder settings - users can only access their own settings
    match /reminder_settings/{userId} {
      allow read, write: if request.auth != null 
        && userId == request.auth.uid;
    }
  }
}
```

### Option 3: Temporary Testing (NOT for Production)
Allows everything (use only for testing):

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

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **waterbuddy-11f7f**
3. Click **"Firestore Database"** in left sidebar
4. Click **"Rules"** tab at the top
5. Replace the current rules with one of the options above
6. Click **"Publish"** button

## Recommended for Now

Use **Option 1** (allows authenticated users) - it's secure enough for development and will let your app work:

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

This means:
- ✅ Only authenticated (logged-in) users can access data
- ✅ Users can read/write their own data (app handles this)
- ✅ Prevents unauthorized access
- ✅ Allows your app to create collections and documents

## After Updating Rules

1. **Publish** the rules
2. **Restart your app** (reload)
3. **Register/Login** in the app
4. **Add water intake** (tap a button)
5. **Check Firestore** - collections should appear!

## Verify Rules Worked

After updating rules and using the app:
- Go to Firestore Database
- You should see collections: `water_intake`, `daily_stats`
- Documents should have your user ID in them

