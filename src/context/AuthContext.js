import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { onSnapshot, doc, collection, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

import { auth, db } from "../components/utils/firebase";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [recipes, setRecipes] = useState([]);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(false);
      setCurrentUser(user);
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (doc) => {
          setDisplayName(doc.data().displayName);
        });
        const q = query(
          collection(db, "Recipes"),
          where("user", "==", user.uid)
        );
        onSnapshot(q, (querySnapshot) => {
          const getRecipeData = [];
          querySnapshot.forEach((doc) => {
            getRecipeData.push(doc);
          });
          setRecipes(getRecipeData);
        });
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    displayName,
    recipes,
    signup,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
