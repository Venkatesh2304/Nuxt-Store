import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3NuDfAbXnS3p2Rz6_D_b-E2pWHGoV3tk",
  authDomain: "nuxta-e9af6.firebaseapp.com",
  projectId: "nuxta-e9af6",
  storageBucket: "nuxta-e9af6.appspot.com",
  messagingSenderId: "740355162338",
  appId: "1:740355162338:web:df9ff940f1dafac00e9ebb",
  measurementId: "G-P882DX7FQL"
};

const fapp = initializeApp(firebaseConfig);
const db = getFirestore(fapp);



export { db }





