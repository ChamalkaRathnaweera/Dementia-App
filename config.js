//firebase config key setup

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage , ref } from 'firebase/storage';


//web app's firebase configuration
const firebaseConfig ={
    apiKey: "AIzaSyCOUBFWSaEP1gw94jclqnFoCrg5tE0JoTM",
  authDomain: "dementiaapp-fc50d.firebaseapp.com",
  projectId: "dementiaapp-fc50d",
  storageBucket: "dementiaapp-fc50d.appspot.com",
  messagingSenderId: "612118151102",
  appId: "1:612118151102:web:e065c6edc4cdca9b4b83ef",
  measurementId: "G-7YYHFBV0RZ"
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

export{firebase};