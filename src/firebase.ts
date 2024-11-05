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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
