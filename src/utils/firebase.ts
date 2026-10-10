import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Character, Letter } from '../types';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Remove undefined values and guard against Firestore's 1MB limit per property.
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = sanitizeForFirestore(value);
      } else if (typeof value === 'string' && value.length > 500000) {
        console.warn(`Property "${key}" exceeds safe Firestore limit (${value.length} bytes), clamping.`);
        result[key] = value.slice(0, 300000);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Clean up legacy static mock entries from initial template.
 * NEVER delete admin-created characters or match user-defined character names!
 */
export const initializeFirestoreData = async () => {
  try {
    const isCleaned = localStorage.getItem('nhat_ky_tu_an_legacy_purged_v3');
    if (!isCleaned) {
      const snapshot = await getDocs(charactersCollection);
      const legacySampleIds = new Set([
        'char-kaelen-valerius-06',
        'char-luc-canh-tieu-07',
        'char-ren-amamiya-08'
      ]);

      snapshot.forEach((d) => {
        if (legacySampleIds.has(d.id)) {
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

      localStorage.setItem('nhat_ky_tu_an_legacy_purged_v3', 'true');
    }
  } catch (err) {
    console.error('Error during Firestore initialization:', err);
  }
};
