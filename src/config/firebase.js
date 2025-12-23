import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_VnQnJU_0DzS5ICt5ekOEYrkRndMw7GI",
  authDomain: "waterbuddy-11f7f.firebaseapp.com",
  projectId: "waterbuddy-11f7f",
  storageBucket: "waterbuddy-11f7f.firebasestorage.app",
  messagingSenderId: "396496318922",
  appId: "1:396496318922:web:bbae782cd23f7d7ecfdf33",
  measurementId: "G-FK9DFL3R92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;

