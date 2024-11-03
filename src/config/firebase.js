import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARYl7IrCk6VuT9nwH_clDqWlOfdD-MsEk",
  authDomain: "hackathon-1728e.firebaseapp.com",
  projectId: "hackathon-1728e",
  storageBucket: "hackathon-1728e.firebasestorage.app",
  messagingSenderId: "273952475619",
  appId: "1:273952475619:web:8ea7ea5b7a9eedfdd878d6",
  measurementId: "G-5J8X82825B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };