import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkzzWK_7FZuzkGUOyHInGRMvczoR5NNyA",
  authDomain: "tipcardjs.firebaseapp.com",
  projectId: "tipcardjs",
  storageBucket: "tipcardjs.appspot.com",
  messagingSenderId: "259933955148",
  appId: "1:259933955148:web:18550bded904821bb280e9",
  measurementId: "G-C5HG6MVBRP"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.warn('Auth persistence setup failed:', error);
  });

// Initialize Firestore with enhanced offline support
let db;
try {
  db = getFirestore(app);
  // Enable offline persistence only if it hasn't been enabled yet
  enableIndexedDbPersistence(db, {
    forceOwnership: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence unavailable - multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence unavailable - browser not supported');
    }
  });
} catch (error) {
  // If Firestore is already initialized, get the existing instance
  console.warn('Using existing Firestore instance');
  db = getFirestore(app);
}

// Export configured instances
export { auth, db };
export default app;