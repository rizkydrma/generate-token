// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCDe-4H6zOzf5tI5rkorq6njIkCRKT7uII",
	authDomain: "pesantrenqu-ee2cf.firebaseapp.com",
	projectId: "pesantrenqu-ee2cf",
	storageBucket: "pesantrenqu-ee2cf.appspot.com",
	messagingSenderId: "487894257410",
	appId: "1:487894257410:web:38909e1ca2558d7dc5bc1b",
	measurementId: "G-0FPSW6M1LW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
