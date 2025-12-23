# Debugging "Missing or insufficient permissions" Error

## Quick Checklist

### 1. Verify You're Actually Logged In
- Check: Does the app show the main screen (water bottle) or login screen?
- If login screen: You need to register/login first
- If main screen: You should be authenticated

### 2. Verify Firestore Rules
Go to Firebase Console → Firestore Database → Rules

**Should be:**
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

**Make sure:**
- Rules are exactly as above
- You clicked "Publish" after updating
- No typos in the rules

### 3. Verify Authentication is Enabled
Go to Firebase Console → Authentication → Sign-in method

**Should see:**
- "Email/Password" with status "Enabled" (green checkmark)

### 4. Check Your User in Firebase
Go to Firebase Console → Authentication → Users

**Should see:**
- Your email address listed
- Status should be active

### 5. Test the Rules
Try this in Firebase Console:
1. Go to Firestore Database → Data tab
2. Try to manually create a document
3. If it works, rules are correct
4. If it fails, rules need fixing

## Common Issues

### Issue: Rules not published
**Solution:** Make sure you clicked "Publish" after editing rules

### Issue: Not actually authenticated
**Solution:** 
- Logout and login again
- Check Firebase Console → Authentication → Users to see if you're there

### Issue: Auth token not ready
**Solution:** 
- Wait a few seconds after login before using the app
- The code now has a 500ms delay to help with this

### Issue: Wrong project
**Solution:** 
- Make sure you're looking at project "waterbuddy-11f7f"
- Check your firebase.js config matches

## Test Steps

1. **Logout** (if logged in)
2. **Register** a new account
3. **Wait 2 seconds** after registration
4. **Add water** (tap a button)
5. **Check console** for errors
6. **Check Firestore** - should see collections

## Still Not Working?

Check the browser/device console for:
- Exact error message
- Error code
- Stack trace

Common error codes:
- `permission-denied` - Rules blocking access
- `unauthenticated` - Not logged in
- `unavailable` - Firestore offline/not accessible

## Alternative: Test with Open Rules (Temporary)

For testing only, use these rules:

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

**Warning:** This allows anyone to access your database. Only use for testing!

If this works, the issue is with authentication. If it doesn't, the issue is with Firestore setup.

