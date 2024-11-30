import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDsm9eLK60DgbIPTIXGWzvBRGbvBPUZsJg",
  authDomain: "mighty-pinner.firebaseapp.com",
  projectId: "mighty-pinner",
  storageBucket: "mighty-pinner.firebasestorage.app",
  messagingSenderId: "475747703677",
  appId: "1:475747703677:web:7f0f9bf347a75eda1c0a14"
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }

