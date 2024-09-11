// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("Initializing Firebase app");
const app = initializeApp(firebaseConfig);

console.log("Initializing Firebase auth");
export const auth = getAuth(app);

console.log("Initializing Google auth provider");
export const googleProvider = new GoogleAuthProvider();

console.log("Initializing Firestore");
export const db = getFirestore(app);

console.log("Firebase services initialized");