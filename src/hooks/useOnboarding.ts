import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  email: 'demo@hotel.com',
  password: 'demo123',
  orgId: 'DEMO1234'
};

// Offline data store
const offlineStore = {
  get: (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading from offline store:', e);
      return null;
    }
  },
  set: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error writing to offline store:', e);
      return false;
    }
  }
};

export const useOnboarding = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const handleSuccessfulAuth = useCallback((hotelData: any) => {
    setIsAuthenticated(true);
    setIsOnboarded(true);
    offlineStore.set('isAuthenticated', true);
    offlineStore.set('onboardingComplete', true);
    offlineStore.set('hotelDetails', hotelData);
  }, []);

  const handleOfflineAuth = useCallback(() => {
    setIsOfflineMode(true);
    setIsAuthenticated(true);
    setIsOnboarded(false);
  }, []);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setIsOnboarded(false);
    offlineStore.set('isAuthenticated', false);
    offlineStore.set('onboardingComplete', false);
    offlineStore.set('hotelDetails', null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!isMounted) return;

        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'hotels', user.uid));
            if (userDoc.exists()) {
              const hotelData = userDoc.data();
              handleSuccessfulAuth(hotelData);
            } else {
              handleOfflineAuth();
            }
          } catch (error) {
            console.warn('Firebase error, falling back to offline mode:', error);
            handleOfflineAuth();
          }
        } else {
          handleSignOut();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    // Check if we're in offline mode
    const offlineData = offlineStore.get('hotelDetails');
    if (offlineData && isMounted) {
      setIsOfflineMode(true);
      handleSuccessfulAuth(offlineData);
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [handleSuccessfulAuth, handleOfflineAuth, handleSignOut]);

  const generateOrgId = useCallback(() => {
    return 'HTL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const demoHotelDetails = {
          hotelName: 'Demo Hotel',
          email: DEMO_CREDENTIALS.email,
          phone: '+1 234 567 8900',
          address: '123 Demo Street',
          city: 'Demo City',
          state: 'DS',
          zipCode: '12345',
          orgId: DEMO_CREDENTIALS.orgId
        };
        handleSuccessfulAuth(demoHotelDetails);
        return true;
      }

      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const hotelDoc = await getDoc(doc(db, 'hotels', userCredential.user.uid));
        
        if (hotelDoc.exists()) {
          handleSuccessfulAuth(hotelDoc.data());
          return true;
        }
      } catch (error) {
        console.warn('Firebase auth failed, using offline mode:', error);
      }

      const offlineData = offlineStore.get('hotelDetails');
      if (offlineData && offlineData.email === email) {
        handleSuccessfulAuth(offlineData);
        return true;
      }

      throw new Error('Invalid credentials');
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const register = async (hotelData: any): Promise<boolean> => {
    try {
      const orgId = generateOrgId();
      const hotelDocData = {
        ...hotelData,
        orgId,
        uid: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        subscription: 'free',
        rooms: [],
        staff: []
      };

      delete hotelDocData.password;
      delete hotelDocData.confirmPassword;

      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          hotelData.email,
          hotelData.password
        );
        
        await setDoc(doc(db, 'hotels', userCredential.user.uid), {
          ...hotelDocData,
          uid: userCredential.user.uid
        });
      } catch (error) {
        console.warn('Firebase registration failed, using offline mode:', error);
      }

      handleSuccessfulAuth(hotelDocData);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const resetOnboarding = async () => {
    try {
      if (!isOfflineMode) {
        await signOut(auth);
      }
      handleSignOut();
      window.location.href = '/signin';
    } catch (error) {
      console.error('Logout error:', error);
      handleSignOut();
      window.location.href = '/signin';
    }
  };

  return { 
    isOnboarded, 
    isAuthenticated,
    isLoading,
    isOfflineMode,
    signIn,
    resetOnboarding,
    register,
    DEMO_CREDENTIALS 
  };
};