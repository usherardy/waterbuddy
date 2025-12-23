import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Register a new user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Authentication not enabled. Please enable Email/Password in Firebase Console.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please sign in instead.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check and try again.';
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
};

// Sign in existing user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Authentication not enabled. Please enable Email/Password in Firebase Console.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please register first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check and try again.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

