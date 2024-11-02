// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// const firebaseConfig = {
//   apiKey: "AIzaSyAO2-IvqfMtP38qsm-cPlC04nIO44dMILM",
//   authDomain: "another-8cf95.firebaseapp.com",
//   projectId: "another-8cf95",
//   storageBucket: "another-8cf95.firebasestorage.app",
//   messagingSenderId: "225053983862",
//   appId: "1:225053983862:web:c3325aaeb32a2a81cc8b57",
//   measurementId: "G-0FV8C3LRWQ"
// };
// const app = initializeApp(firebaseConfig);
// export const auth=getAuth(app)
// export const db=getFirestore(app)
// export const provider=new GoogleAuthProvider()
// src/firebase.js
// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAO2-IvqfMtP38qsm-cPlC04nIO44dMILM",
  authDomain: "another-8cf95.firebaseapp.com",
  projectId: "another-8cf95",
  storageBucket: "another-8cf95.appspot.com",
  messagingSenderId: "225053983862",
  appId: "1:225053983862:web:c3325aaeb32a2a81cc8b57",
  measurementId: "G-0FV8C3LRWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
