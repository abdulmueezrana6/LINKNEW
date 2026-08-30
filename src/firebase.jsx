// src/firebase.js (hoặc tạo một tệp tương tự)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBC2nWK7LeIhHWzaJAr_4BxK4kS79R_wtw",
  authDomain: "linkphamv2.firebaseapp.com",
  projectId: "linkphamv2",
  storageBucket: "linkphamv2.firebasestorage.app",
  messagingSenderId: "309886951228",
  appId: "1:309886951228:web:8d0286bf347f10cd854839"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
