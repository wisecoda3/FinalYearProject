// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcRkvri4Em8x45yxHCqF3GyplkM3h327I",
    authDomain: "donation-platform-4bd4a.firebaseapp.com",
    databaseURL: "https://donation-platform-4bd4a.firebaseio.com",
    projectId: "donation-platform-4bd4a",
    storageBucket: "donation-platform-4bd4a.firebasestorage.app",
    messagingSenderId: "609010845885",
    appId: "1:609010845885:web:5c98483e18b1c088638fd4",
    measurementId: "G-S6PJBYR2NZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
