import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// O Expo disponibiliza variáveis EXPO_PUBLIC_* no JavaScript do aplicativo.
// A configuração do Firebase NÃO é uma credencial administrativa.
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigurado =
  Object.values(config).every((item) => typeof item === 'string' && item.trim().length > 0) &&
  !String(config.apiKey).startsWith('SUA_') &&
  !String(config.projectId).startsWith('seu-');

const app = firebaseConfigurado ? (getApps().length ? getApp() : initializeApp(config)) : null;

let authInstance = null;
let firestoreInstance = null;

if (app) {
  try {
    // Mantém a sessão salva entre fechamentos do aplicativo.
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // O Hot Reload do Expo pode tentar inicializar o Auth duas vezes.
    if (error?.code === 'auth/already-initialized') {
      authInstance = getAuth(app);
    } else {
      throw error;
    }
  }
  firestoreInstance = getFirestore(app);
}

export const auth = authInstance;
export const db = firestoreInstance;
