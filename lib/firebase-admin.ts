// Firebase Admin SDK Configuration
// This file initializes Firebase Admin for server-side use (API routes)

import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Initialize Firebase Admin (singleton pattern)
if (getApps().length === 0) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  initializeApp({
    credential: cert(serviceAccount),
  })
}

// Export initialized services
export const adminAuth = getAuth()
export const adminDb = getFirestore()
export const adminStorage = getStorage()

// Initialize Firestore settings
adminDb.settings({ ignoreUndefinedProperties: true })
