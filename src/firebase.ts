import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCkzzWK_7FZuzkGUOyHInGRMvczoR5NNyA",
  authDomain: "tipcardjs.firebaseapp.com",
  projectId: "tipcardjs",
  storageBucket: "tipcardjs.appspot.com",
  messagingSenderId: "259933955148",
  appId: "1:259933955148:web:18550bded904821bb280e9",
  measurementId: "G-C5HG6MVBRP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);