// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCegmEeKF1EGcmRLh0KV3_EWy8hzJo4iy8",
  authDomain: "hart-telemetry.firebaseapp.com",
  databaseURL:
    "https://hart-telemetry-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hart-telemetry",
  storageBucket: "hart-telemetry.firebasestorage.app",
  messagingSenderId: "909683235393",
  appId: "1:909683235393:web:85d8bba8623a5758f804c0",
  measurementId: "G-SZR4WCH3LC",
};
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
