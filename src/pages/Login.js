import React, { useCallback }from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "../components/LoginForm";

function Login({ setErrors, setLoggedIn, setUserInformation }) {
  const loginUser = useCallback(
    (e) => {
      e.preventDefault();

      const email = e.currentTarget.email.value;
      const password = e.currentTarget.password.value;

      const auth = getAuth;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setLoggedIn(true);
          setUserInformation({
            email: user.email,
            displayName: user.displayName,
            uid: user.uid,
            accessToken: user.accessToken,
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.warn({ error, errorCode, errorMessage });
        });
    },
    [ setLoggedIn, setUserInformation]
  );
  return (
    <div className="PageWrapper">
      <h1>Login</h1>
      <LoginForm loginUser={loginUser}/> 
    </div>
  );
}

export default Login;