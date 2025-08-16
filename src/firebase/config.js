// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBbwaK4SkACesSqM5zSYphzFkYrLxNYFKg",
  authDomain: "surat-8317d.firebaseapp.com",
  projectId: "surat-8317d",
  storageBucket: "surat-8317d.firebasestorage.app",
  messagingSenderId: "1038209960698",
  appId: "1:1038209960698:web:25f5b0014ec56bad8fd743",
  measurementId: "G-VYGFC6FXZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;