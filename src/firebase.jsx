// src/firebase.js (hoặc tạo một tệp tương tự)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCYD7G0HjJ3GZq94Xn6IVHvNCMg3nqT478",
  authDomain: "link03-a40d2.firebaseapp.com",
  projectId: "link03-a40d2",
  storageBucket: "link03-a40d2.firebasestorage.app",
  messagingSenderId: "633770638873",
  appId: "1:633770638873:web:7d302282e80860b292f488"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
