import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKuILMln0d6znQHv4rv9w0GWA2piXntTo",
  authDomain: "aegl-557fa.firebaseapp.com",
  projectId: "aegl-557fa",
  storageBucket: "aegl-557fa.firebasestorage.app",
  messagingSenderId: "286688153739",
  appId: "1:286688153739:web:c278fe6cc6d6c3db69c48e",
  measurementId: "G-RV761R0YBL",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("Firebase config:", firebaseConfig);

