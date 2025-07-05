// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPDU7K31PKv7UN4mx3-r0sm0MkLwcuJHo",
  authDomain: "untrash-2025.firebaseapp.com",
  projectId: "untrash-2025",
  storageBucket: "untrash-2025.appspot.com",
  messagingSenderId: "689877533058",
  appId: "1:689877533058:web:07510c414780e11b888f9b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export const storage = getStorage(app);
