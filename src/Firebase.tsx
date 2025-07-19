// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVHqpujkFIHaJzS4j2BFtMTqHcSr_AcpU",
  authDomain: "restless-c0e2e.firebaseapp.com",
  projectId: "restless-c0e2e",
  storageBucket: "restless-c0e2e.firebasestorage.app",
  messagingSenderId: "232735578459",
  appId: "1:232735578459:web:5aa03814f406421e29627e",
  measurementId: "G-GTDPDVFG48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };