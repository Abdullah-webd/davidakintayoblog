// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-90f5c.firebaseapp.com",
  projectId: "mern-blog-90f5c",
  storageBucket: "mern-blog-90f5c.firebasestorage.app",
  messagingSenderId: "863984153633",
  appId: "1:863984153633:web:90ca25b50ee5102b679f60",
  measurementId: "G-ZH1S23QDZ0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);