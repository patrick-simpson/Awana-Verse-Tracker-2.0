import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

/**
 * Firebase initialization using the modular SDK.
 * Configured with the project's specific credentials for Awana Africa.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCk0TR4SUFUvsdpIDGmH-0CzbZQQcZBL30",
  authDomain: "awana-africa-tracker.firebaseapp.com",
  databaseURL: "https://awana-africa-tracker-default-rtdb.firebaseio.com",
  projectId: "awana-africa-tracker",
  storageBucket: "awana-africa-tracker.firebasestorage.app",
  messagingSenderId: "825987576771",
  appId: "1:825987576771:web:f293d618dad3ded2c70376",
  measurementId: "G-1SMFYMQMNW"
};

let db: any = null;
let verseRef: any = null;

try {
  const app = initializeApp(firebaseConfig);
  // Get database instance using modular syntax
  db = getDatabase(app);
  // Export reference to 'verses' node specifically for this application
  verseRef = ref(db, 'verses');
  console.log("Firebase initialized successfully");
} catch (e) {
  console.error("Firebase failed to load. Running in local offline mode.");
  // Allow application to continue in offline/fallback mode
}

export { db, verseRef, onValue, set };
