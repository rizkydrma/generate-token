// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPV_InUZvc_aKhfKAKdXToVT1IrNlOXI4",
  authDomain: "menara-unisma.firebaseapp.com",
  projectId: "menara-unisma",
  storageBucket: "menara-unisma.appspot.com",
  messagingSenderId: "862913228595",
  appId: "1:862913228595:web:3d841402f8bf4371b0d846",
  measurementId: "G-0YBVZZXSL5",
};

const firebaseConfigPQU = {
  apiKey: "AIzaSyBche3EI40pT9p2RmQ6BfeBr0a7xDgvJX4",
  authDomain: "pesantrenqu-ee2cf.firebaseapp.com",
  projectId: "pesantrenqu-ee2cf",
  storageBucket: "pesantrenqu-ee2cf.firebasestorage.app",
  messagingSenderId: "487894257410",
  appId: "1:487894257410:web:144e8e53399cd753c5bc1b",
  measurementId: "G-ZPRKNZXV3G",
};

const firebaseConfigBaznas = {
  apiKey: "AIzaSyC0DTxuxU8fBP6yIOAHzIFwgbWkjjZnxTU",
  authDomain: "baznas-indonesia-firebase.firebaseapp.com",
  projectId: "baznas-indonesia-firebase",
  storageBucket: "baznas-indonesia-firebase.firebasestorage.app",
  messagingSenderId: "736958220647",
  appId: "1:736958220647:web:715f9957da5ec3c76087c2",
  measurementId: "G-M3QRCSP7JK",
};

const app = initializeApp(firebaseConfig, "app_menara");
export const auth = getAuth(app);
export const db = getFirestore(app);

const appPqu = initializeApp(firebaseConfigPQU, "app_pqu");
export const authPqu = getAuth(appPqu);

const appBaznas = initializeApp(firebaseConfigBaznas, "app_baznas");
export const authBaznas = getAuth(appBaznas);
