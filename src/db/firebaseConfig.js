import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB_glAoBTysdYOyJGvVIC0fCyKmBEgk7-c",
  authDomain: "entre-tazas.firebaseapp.com",
  projectId: "entre-tazas",
  storageBucket: "entre-tazas.firebasestorage.app",
  messagingSenderId: "372132177449",
  appId: "1:372132177449:web:1384b4de0005444348de38",
  measurementId: "G-GFHV8LNP4Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
