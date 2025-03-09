// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-auth-domain",
    projectId: "seu-project-id",
    storageBucket: "seu-storage-bucket",
    messagingSenderId: "seu-sender-id",
    appId: "seu-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };