import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc,
  query,
  where,
  enableNetwork,
  disableNetwork,
  DocumentData
} from 'firebase/firestore';

// Cache for offline data
const offlineCache = new Map<string, any>();

export const setOfflineData = (key: string, data: any) => {
  offlineCache.set(key, data);
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save offline data:', error);
  }
};

export const getOfflineData = (key: string) => {
  if (offlineCache.has(key)) {
    return offlineCache.get(key);
  }
  try {
    const data = localStorage.getItem(`offline_${key}`);
    if (data) {
      const parsed = JSON.parse(data);
      offlineCache.set(key, parsed);
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to retrieve offline data:', error);
  }
  return null;
};

export const fetchWithOfflineSupport = async <T extends DocumentData>(
  path: string,
  id: string
): Promise<T | null> => {
  try {
    // Try to fetch from Firestore first
    const docRef = doc(db, path, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as T;
      setOfflineData(`${path}_${id}`, data);
      return data;
    }
    
    // If online fetch fails, try offline cache
    const offlineData = getOfflineData(`${path}_${id}`);
    if (offlineData) {
      return offlineData as T;
    }
    
    return null;
  } catch (error) {
    console.warn('Error fetching data, falling back to offline cache:', error);
    const offlineData = getOfflineData(`${path}_${id}`);
    return offlineData as T | null;
  }
};

export const saveWithOfflineSupport = async <T extends DocumentData>(
  path: string,
  id: string,
  data: T
): Promise<boolean> => {
  try {
    // Try to save to Firestore
    const docRef = doc(db, path, id);
    await setDoc(docRef, data, { merge: true });
    
    // Update offline cache
    setOfflineData(`${path}_${id}`, data);
    return true;
  } catch (error) {
    console.warn('Error saving data, storing offline:', error);
    setOfflineData(`${path}_${id}`, data);
    return false;
  }
};

export const checkOnlineStatus = async (): Promise<boolean> => {
  try {
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.warn('Firebase is offline:', error);
    try {
      await disableNetwork(db);
    } catch (disableError) {
      console.warn('Failed to disable network:', disableError);
    }
    return false;
  }
};

export const syncOfflineData = async () => {
  try {
    const isOnline = await checkOnlineStatus();
    if (!isOnline) {
      return false;
    }

    for (const [key, value] of offlineCache.entries()) {
      const [path, id] = key.split('_');
      if (path && id && value) {
        try {
          await setDoc(doc(db, path, id), value, { merge: true });
        } catch (error) {
          console.warn(`Failed to sync offline data for ${key}:`, error);
        }
      }
    }
    return true;
  } catch (error) {
    console.warn('Failed to sync offline data:', error);
    return false;
  }
};