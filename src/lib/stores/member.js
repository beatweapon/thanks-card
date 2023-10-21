import { writable } from 'svelte/store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'src/lib/firebase_client';

export const members = writable([{ name: 'tatsuya akimoto' }, { name: 'kento ueda' }]);
