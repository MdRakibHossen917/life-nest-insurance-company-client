import React, { useEffect, useState, createContext } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [userProfile, setUserProfile] = useState(null);  
  const [loading, setLoading] = useState(true);

  // ✅ Register
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Email Login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Google Login
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ✅ Update Profile
  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  // ✅ Logout
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token"); // token clear
    return signOut(auth);
  };

  // ✅ Listen to Firebase User State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        try {
          // fresh token
          const token = await currentUser.getIdToken(true);

          // save token in localStorage
          localStorage.setItem("access-token", token);

          // fetch backend profile
          const { data } = await axios.get(
            `https://life-nest-company-server.vercel.app/users/${currentUser.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
              },
            }
          );
          setUser(currentUser);
          setUserProfile(data);
        } catch (error) {
          console.error("❌ Failed to fetch backend profile:", error);
          setUser(currentUser); // at least Firebase user set হোক
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // axios interceptor → auto logout if token invalid
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logOut();
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const authInfo = {
    user,
    userProfile,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
