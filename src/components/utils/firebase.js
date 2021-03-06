// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4uzuSrT5BZq079HcgNFfN5QObTB0kx-o",
  authDomain: "vt-eats.firebaseapp.com",
  projectId: "vt-eats",
  storageBucket: "vt-eats.appspot.com",
  messagingSenderId: "74127811132",
  appId: "1:74127811132:web:191d28ec3ebb786fcd9939",
  measurementId: "G-G92PY04XCX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     //const recipeSnapshot = await getDocs(collection(db, "Recipes"));
//     // const currUserData = await getDoc(doc(db, "users", user.uid));
//     // let currUserDisplayName = currUserData.data().displayName;
//     let currUserDisplayName = "";
//     setupUI(user, currUserDisplayName);
//     //setupRecipes(recipeSnapshot);
//   } else {
//     setupUI();
//     //setupRecipes([]);
//   }
// });
