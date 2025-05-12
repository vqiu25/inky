import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import styles from "../assets/css-modules/LoginPage.module.css";
import logo from "../assets/images/logo.svg";

import GoogleSignInButton from "../components/signInComponents/GoogleSignInButton";
import { User } from "../types/types";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { addUser, getUserByEmail, getUsers, setCurrentUserFromLocalStorage } =
    useContext(UsersContext)!;
  const { setJwt, setIsAuthenticated } = useContext(AuthContext)!;
  const navigate = useNavigate();

  function getRandomProfilePicture(): string {
    const filenames = [
      "alicorn.png",
      "bear.png",
      "cat.svg",
      "crow.svg",
      "dog.svg",
      "dove.svg",
      "dragon.svg",
      "fish.svg",
      "frog.svg",
      "hippo.svg",
      "horse.svg",
      "kiwi.svg",
      "mosquito.svg",
      "otter.svg",
      "shrimp.svg",
      "worm.svg",
    ];

    const randomIndex = Math.floor(Math.random() * filenames.length);
    return `profile-pictures/${filenames[randomIndex]}`;
  }

  async function handleGoogleResponse(response: unknown) {
    const users = await getUsers();

    const jwt = (response as { credential: string }).credential;
    setJwt(jwt);
    setIsAuthenticated(true);
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
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setCurrentUserFromLocalStorage();
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
