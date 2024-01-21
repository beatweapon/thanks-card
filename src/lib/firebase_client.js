import {
  PUBLIC_API_KEY,
  PUBLIC_AUTH_DOMAIN,
  PUBLIC_PROJECT_ID,
  PUBLIC_MESSAGING_SENDER_ID,
  PUBLIC_APP_ID,
} from '$env/static/public';
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: PUBLIC_API_KEY,
  authDomain: PUBLIC_AUTH_DOMAIN,
  projectId: PUBLIC_PROJECT_ID,
  appId: PUBLIC_APP_ID,
  messagingSenderId: PUBLIC_MESSAGING_SENDER_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

void setPersistence(auth, inMemoryPersistence);
