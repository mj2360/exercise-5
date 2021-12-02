import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import CreateUser from "./pages/CreateUser";
import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import FirebaseConfig from "./components/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function App() {
 // const app = initializeApp(FirebaseConfig);

  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(true);

  const [appInitialized, setAppIntialized] = useState(false);

  const [userInformation, setUserInformation] = useState({});


  useEffect(() => {
    initializeApp(FirebaseConfig);
    setAppIntialized(true); 
  }, []);

  useEffect(() => {
    const auth = getAuth();
    if (appInitialized) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //Logged in
          setUserInformation(user);
          setLoggedIn(true);
        } else {
          //Not Logged in
          setUserInformation({});
          setLoggedIn(false);
        }
        setLoading(false);
      });
    }
  }, [appInitialized]);

  function logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUserInformation({});
        setLoggedIn(false);
      })
      .catch((error) => {
        console.warn(error);

      });
  }

  if (loading || !appInitialized) return null;
  return (
    //brackets wrap the application ---> short hand for a React.fragment
    //better than wrapping in a div
    <>
      <Header logOut={logOut} loggedIn={loggedIn} />
      <Router>
        <Routes>
          <Route
            path="/user/:id"
            element={
              loggedIn ? (
                <UserProfile userInformation={userInformation} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/create"
            element={
              loggedIn ? (
                <CreateUser
                  setLoggedIn={setLoggedIn}
                  setUserInformation={setUserInformation}
                />
              ) : (
                <Navigate to={`/user/${userInformation.uid}`} />
              )
            }
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                <Login
                  setLoggedIn={setLoggedIn}
                  setUserInformation={setUserInformation}
                />
              ) : (
                <Navigate to={`/user/${userInformation.uid}`} />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;