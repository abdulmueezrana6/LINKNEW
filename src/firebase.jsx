// src/firebase.js (hoặc tạo một tệp tương tự)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBc6Ie1Va2rN_ixnKcKEHW7iRnOE8PDX2I",
  authDomain: "link02-e1281.firebaseapp.com",
  projectId: "link02-e1281",
  storageBucket: "link02-e1281.firebasestorage.app",
  messagingSenderId: "288434678265",
  appId: "1:288434678265:web:afd97260d58765e0027528"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
