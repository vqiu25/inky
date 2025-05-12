import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContext";
import styles from "../assets/css-modules/LoginPage.module.css";
import logo from "../assets/images/logo.svg";
import alicorn from "../assets/images/profile-pictures/alicorn.png";

import GoogleSignInButton from "../components/signInComponents/GoogleSignInButton";
import { User } from "../types/types";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const {
    addUser,
    getUserByEmail,
    getUsers,
    setCurrentUserFromLocalStorage,
  } = useContext(UsersContext)!;
  const { setJwt, setIsAuthenticated } = useContext(AuthContext)!;
  const navigate = useNavigate();

  // Import all SVG images from profile-pictures folder
  const images = import.meta.glob("/src/assets/images/profile-pictures/*.svg");

  function getRandomProfilePicture(): string {
    // Get the file paths from the keys of the `images` object
    const profilePictures = Object.keys(images);
    profilePictures.push(alicorn);

    // Select a random image
    const randomIndex = Math.floor(Math.random() * profilePictures.length);
    return profilePictures[randomIndex];
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
