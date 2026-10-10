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

// Initialize Firestore data without sample characters (starts empty until admin creates)
export const initializeFirestoreData = async () => {
  try {
    const snapshot = await getDocs(charactersCollection);
    
    // Purge any lingering sample characters (Kaelen, Lục Cảnh Tiêu, Ren Amamiya) if present
    snapshot.forEach((d) => {
      const data = d.data() as Character;
      if (
        d.id === 'char-kaelen-valerius-06' ||
        d.id === 'char-luc-canh-tieu-07' ||
        d.id === 'char-ren-amamiya-08' ||
        data?.name?.toLowerCase().includes('kaelen') ||
        data?.name?.toLowerCase().includes('lục cảnh tiêu') ||
        data?.name?.toLowerCase().includes('ren amamiya')
      ) {
        deleteDoc(doc(db, 'characters', d.id)).catch(() => {});
      }
    });

    // Purge any sample letters if present
    const lettersSnapshot = await getDocs(lettersCollection);
    lettersSnapshot.forEach((d) => {
      const data = d.data() as Letter;
      if (d.id.startsWith('letter-sample-') || data?.id?.startsWith('letter-sample-')) {
        deleteDoc(doc(db, 'letters', d.id)).catch(() => {});
      }
    });

    localStorage.setItem('nhat_ky_tu_an_db_initialized', 'true');
  } catch (err) {
    console.error('Error initializing Firestore data:', err);
  }
};
