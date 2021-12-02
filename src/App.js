import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Header";
import CreateUser from "./pages/CreateUser";
import React, { useCallback, useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import FirebaseConfig from "./components/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOUt } from "firebase/auth";

function App() {
  const app = initializeApp(FirebaseConfig);

  const [loggedIn, setLoggedIn] = useState(false);

  const [loading, setLoading] = useState(true);

  const [userInformation, setUserInformation] = useState({});

  const [errors, setErrors] = useState();

  useEffect(() => {
    initializeApp(FirebaseConfig);
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
        setErrors();
      })
      .catch((error) => {
        console.warn(error);
        setErrors(errorMessage);
      });
  }

  if (loading || !appInitialized) return null;
  return (
    //brackets wrap the application ---> short hand for a React.fragment
    //better than wrapping in a div
    <>
      <Header logOut={logOut} loggedIn={loggedIn} />
      {errors && <p className="Error PageWrapper">{errors}</p>}
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
                  setErrors={setErrors}
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
                  setErrors={setErrors}
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