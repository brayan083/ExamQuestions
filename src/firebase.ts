// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyASyJi1dZYpJwy7nUzKV3FTHhar0rde8eY",
  authDomain: "examquestions-becf6.firebaseapp.com",
  projectId: "examquestions-becf6",
  storageBucket: "examquestions-becf6.firebasestorage.app",
  messagingSenderId: "657334303529",
  appId: "1:657334303529:web:d44545553eeeb48e831538",
  measurementId: "G-3B6F61E35V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);