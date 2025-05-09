import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import styles from "../assets/css-modules/LoginPage.module.css";
import logo from "../assets/images/logo.svg";
import drop from "../assets/images/drop.svg";
import paintbrush from "../assets/images/paintbrush.svg";

import GoogleSignInButton from "../components/signInComponents/GoogleSignInButton";
import { User } from "../types/types";

const LoginPage = () => {
  const { setCurrentUser } = useContext(UsersContext)!;
  const { addUser, getUserByEmail, getUsers } = useContext(UsersContext)!;
  const navigate = useNavigate();

  function getRandomProfilePicture() {
    const svgs = [logo, drop, paintbrush];
    const randomIndex = Math.floor(Math.random() * svgs.length);
    return svgs[randomIndex];
  }

  async function handleGoogleResponse(response: unknown) {
    const users = await getUsers();

    const jwt = (response as { credential: string }).credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    console.log("User:", payload);

    console.log("Users:" + users);

    const userExists = users.some((user: User) => user.email === payload.email);

    if (userExists) {
      console.log("User already exists.");
    } else {
      try {
        // Save user in DB
        const profilePicture = getRandomProfilePicture();
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
