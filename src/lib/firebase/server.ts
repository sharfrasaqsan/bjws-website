import "server-only";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

let app: App | undefined;
let firestoreDb: Firestore | undefined;
let firebaseStorage: Storage | undefined;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY)
  );
}

function getFirebaseCredentials() {
  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (rawKey) {
    if (rawKey.startsWith("{")) {
      return JSON.parse(rawKey);
    }
    // Base64 encoded JSON
    return JSON.parse(Buffer.from(rawKey, "base64").toString("utf8"));
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  return null;
}

export function getFirebaseAdminApp(): App | null {
  if (app) return app;
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  const credentials = getFirebaseCredentials();
  if (!credentials) {
    return null;
  }

  app = initializeApp({
    credential: cert(credentials),
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      `${credentials.project_id || credentials.projectId}.firebasestorage.app`,
  });

  return app;
}

export function getFirebaseDb(): Firestore | null {
  if (firestoreDb) return firestoreDb;
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;
  firestoreDb = getFirestore(adminApp);
  return firestoreDb;
}


export function getFirebaseStorage(): Storage | null {
  if (firebaseStorage) return firebaseStorage;
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;
  firebaseStorage = getStorage(adminApp);
  return firebaseStorage;
}
