import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_glAoBTysdYOyJGvVIC0fCyKmBEgk7-c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "entre-tazas.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "entre-tazas",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "entre-tazas.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "372132177449",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:372132177449:web:1384b4de0005444348de38",
  measurementId: "G-GFHV8LNP4Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
