import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  getDocFromCache,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Character, Letter } from '../types';
import { ALL_SAMPLE_PRISONERS } from '../data/sampleCharacters';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Collection references
export const charactersCollection = collection(db, 'characters');
export const lettersCollection = collection(db, 'letters');

// Initialize default sample characters in Firestore if empty
export const initializeFirestoreData = async () => {
  try {
    // Explicitly purge Kaelen Valerius from Firestore if still present
    try {
      await deleteDoc(doc(db, 'characters', 'char-kaelen-valerius-06'));
    } catch {
      // ignore
    }

    const isAlreadyInitialized = localStorage.getItem('nhat_ky_tu_an_db_initialized') === 'true';

    const snapshot = await getDocs(charactersCollection);
    
    // Check if any lingering doc in Firestore is Kaelen Valerius
    snapshot.forEach((d) => {
      const data = d.data() as Character;
      if (d.id === 'char-kaelen-valerius-06' || data?.name?.toLowerCase().includes('kaelen')) {
        deleteDoc(doc(db, 'characters', d.id)).catch(() => {});
      }
    });

    if (snapshot.empty && !isAlreadyInitialized) {
      for (const char of ALL_SAMPLE_PRISONERS) {
        await setDoc(doc(db, 'characters', char.id), char);
      }
      localStorage.setItem('nhat_ky_tu_an_db_initialized', 'true');
    } else {
      localStorage.setItem('nhat_ky_tu_an_db_initialized', 'true');
    }
  } catch (err) {
    console.error('Error initializing Firestore data:', err);
  }
};
