import Navbar from "../components/Navbar";
import "../styles/globals.css";

import { Toaster } from "react-hot-toast";

import { UserContext } from "../lib/context";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, firestore, googleAuthProvider } from '../lib/firebase';

function MyApp({ Component, pageProps }) {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscriptions if there is a username given
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      } )
    } else {
      setUsername(null);
    }

    return unsubscribe;

  }, [user]);

  return (
    <UserContext.Provider value={{ user, username }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
