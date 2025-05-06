import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import styles from "../assets/css-modules/LoginPage.module.css";
import logo from "../assets/images/logo.svg";
import drop from "../assets/images/drop.svg";
import paintbrush from "../assets/images/paintbrush.svg";

import GoogleSignInButton from "../components/signInComponents/GoogleSignInButton";

const LoginPage = () => {
  const { setCurrentUser } = useContext(UsersContext)!;
  const { usersLoading, usersList, addUser, getUserByEmail } =
    useContext(UsersContext)!;
  const navigate = useNavigate();

  function getRandomProfilePicture() {
    const svgs = [logo, drop, paintbrush];
    const randomIndex = Math.floor(Math.random() * svgs.length);
    return svgs[randomIndex];
  }

  let retryCount = 0;

  async function handleGoogleResponse(response: unknown) {
    // Wait until usersLoading is false
    if (usersLoading) {
      if (retryCount < 10) {
        retryCount++;
        setTimeout(() => handleGoogleResponse(response), 500);
      } else {
        console.error("Cannot get users");
      }
      return;
    }
    const jwt = (response as { credential: string }).credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    console.log("User:", payload);

    const profilePicture = getRandomProfilePicture();

    const userExists = usersList.some((user) => user.email === payload.email);

    if (userExists) {
      console.log("User already exists.");
    } else {
      try {
        // Save user in DB
        await addUser(payload.name, profilePicture, payload.email);
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    }

    navigate("/home");

    const currentUser = await getUserByEmail(payload.email);

    if (currentUser) {
      // Add user to context
      setCurrentUser(currentUser);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }

  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo} alt="Logo" />
      <h1 className={styles.title}>Inky</h1>
      <GoogleSignInButton onSignInSuccess={handleGoogleResponse} />
    </div>
  );
};

export default LoginPage;
