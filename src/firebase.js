// Import the functions you need from the SDKs you need
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAp0bz_p_DashNST8N_s7bI1ZAL_PTdAL4",
  authDomain: "vetpet-auth.firebaseapp.com",
  projectId: "vetpet-auth",
  storageBucket: "vetpet-auth.firebasestorage.app",
  messagingSenderId: "755037451095",
  appId: "1:755037451095:web:2201508817cedc2dd98412",
  measurementId: "G-NK53GRV95K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Providers (declarados como const, sin "export" aquí)
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

export { auth, googleProvider, facebookProvider, microsoftProvider };
export default app;