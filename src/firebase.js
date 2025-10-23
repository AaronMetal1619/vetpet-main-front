// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
// providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
// microsoft via OAuthProvider
export const microsoftProvider = new OAuthProvider('microsoft.com');