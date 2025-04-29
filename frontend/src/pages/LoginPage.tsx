import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, AppContextType } from "../AppContextProvider";
import styles from "../assets/LoginPage.module.css";
import logo from "../assets/logo.svg";
import GoogleSignInButton from "../components/GoogleSignInButton";

const LoginPage = () => {
  const { setIsGuest } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  // Function to handle successful Google sign-in
  function handleGoogleResponse(response: unknown) {
    // JWT is returned containing the user's name, email and profile picture
    // TODO: Make API Call to store information from JWT in DB
    const jwt = (response as { credential: string }).credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    console.log("User:", payload);

    navigate("/home");
  }

  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo} alt="Logo" />
      <h1 className={styles.title}>Inky</h1>
      <GoogleSignInButton onSignInSuccess={handleGoogleResponse} />
      <button
        className={styles.button}
        onClick={() => {
          setIsGuest(true);
          navigate("/home");
        }}
      >
        Play as Guest
      </button>
    </div>
  );
};

export default LoginPage;
