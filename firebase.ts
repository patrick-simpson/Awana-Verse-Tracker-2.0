import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set, DatabaseReference } from "firebase/database";

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
let verseRef: DatabaseReference | null = null;

try {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getDatabase(app);
  verseRef = ref(db, 'verses');
  console.log("Firebase Modular SDK initialized successfully");
} catch (e) {
  console.error("Firebase Initialization Failure:", e);
}

export { db, verseRef, onValue, set };