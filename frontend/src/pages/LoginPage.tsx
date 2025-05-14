import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import AnimatedLogo from "../components/homeComponents/AnimatedLogo";
import styles from "../assets/css-modules/LoginPage.module.css";

import GoogleSignInButton from "../components/signInComponents/GoogleSignInButton";
import { User } from "../types/types";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { addUser, getUsers, updateCurrentUser } = useContext(UsersContext)!;
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
    setJwt(jwt);
    setIsAuthenticated(true);
    const payload = JSON.parse(atob(jwt.split(".")[1]));

    const userExists = users.some((user: User) => user.email === payload.email);

    if (!userExists) {
      try {
        // Save user in DB
        const profilePicture = getRandomProfilePicture();
        const currentUser = await addUser(
          payload.name,
          profilePicture,
          payload.email,
        );
        updateCurrentUser(currentUser);
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    }

    navigate("/home");
  }

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "-30px" }}>
        <AnimatedLogo size={120} hoverThreshold={150} />
      </div>
      <h1 className={styles.title}>Inky</h1>
      <GoogleSignInButton onSignInSuccess={handleGoogleResponse} />
    </div>
  );
};

export default LoginPage;
