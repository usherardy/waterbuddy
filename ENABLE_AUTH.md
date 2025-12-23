# Enable Firebase Authentication

## Quick Steps to Enable Authentication

The error "auth/configuration-not-found" means Firebase Authentication is not enabled. Follow these steps:

### 1. Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **waterbuddy-11f7f**

### 2. Enable Authentication
1. In the left sidebar, click **"Authentication"** (or "Build" → "Authentication")
2. Click **"Get Started"** (if you see this button)
3. You'll see the Authentication dashboard

### 3. Enable Email/Password Sign-in
1. Click on the **"Sign-in method"** tab (at the top)
2. You'll see a list of sign-in providers
3. Click on **"Email/Password"**
4. Toggle **"Enable"** to ON
5. Optionally enable **"Email link (passwordless sign-in)"** if you want (not required)
6. Click **"Save"**

### 4. Verify
- You should see "Email/Password" with a green checkmark
- The status should show "Enabled"

## That's it!

Once enabled, restart your app and try registering/logging in again. The error should be resolved.

## Alternative: Test with Anonymous Auth (Optional)

If you want to test quickly without email/password:
1. Go to Authentication → Sign-in method
2. Enable **"Anonymous"**
3. Update the code to use anonymous authentication

But Email/Password is recommended for production use.

