import React, { createContext, useState, useEffect } from "react";
import firebase from "firebase";
const AuthContext = createContext();

const AuthProvider = (props) => {
  // user null = loading
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLogin();
  }, []);

  function checkLogin() {
    firebase.auth().onAuthStateChanged(function (u) {
      if (u) {
        if (u.emailVerified == true) {
          //on verifie que le mail soit verifier avant de connecter le user
          setUser(true);
          return;
        } else {
          setUser(false);
          return;
        }
        // getUserData();
      } else {
        setUser(false);
        return;
        // setUserData(null);
      }
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
