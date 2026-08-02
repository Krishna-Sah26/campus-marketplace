// Import
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config (Firebase console se copy karo)
const firebaseConfig = {
  apiKey: "AIzaSyAlETWn2OommOqrbdlJ8lQ6Rn1zAkfaDxg",
  authDomain: "campusmarketpla.firebaseapp.com",
  projectId: "campusmarketpla",
  storageBucket: "campusmarketpla.firebasestorage.app",
  messagingSenderId: "273938133953",
  appId: "1:273938133953:web:7715236b3ea21502dbb540"
};

// Init
const app = initializeApp(firebaseConfig);

// Export
export const auth = getAuth(app);
export const db = getFirestore(app);