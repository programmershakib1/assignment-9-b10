import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleSignUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const handleSignIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const handleGithubLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleUserDelete = () => {
    const user = auth.currentUser;
    if (user) {
      deleteUser(user)
        .then((result) => {
          setUser(result.user);
        })
        .catch((error) => {
          setErrorMessage(error.code);
        });
    }
  };

  // const pronounceWord = (word) => {
  //   const utterance = new SpeechSynthesisUtterance(word);
  //   utterance.lang = "ja-JP"; // Japanese
  //   window.speechSynthesis.speak(utterance);
  // };

  const animationValue = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 1 },
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const authInfo = {
    handleSignUp,
    handleSignIn,
    handleGoogleLogin,
    handleGithubLogin,
    handleSignOut,
    handleUserDelete,
    // pronounceWord,
    animationValue,
    user,
    setUser,
    loading,
    setLoading,
    errorMessage,
    setErrorMessage,
    emailValue,
    setEmailValue,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.element,
};

export default AuthProvider;
