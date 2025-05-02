import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayersContext } from "../context/PlayersContextProvider";
import { UsersContext } from "../context/UsersContextProvider";
import { Player } from "../types/types";
import styles from "../assets/css-modules/LoginPage.module.css";
import logo from "../assets/images/logo.svg";
import drop from "../assets/images/drop.svg";
import paintbrush from "../assets/images/paintbrush.svg";

import GoogleSignInButton from "../components/GoogleSignInButton";

const LoginPage = () => {
  const { playersList, setPlayersList, setCurrentPlayer } =
    useContext(PlayersContext)!;
  const { usersLoading, users, addUser, getUserByEmail } =
    useContext(UsersContext)!;
  const navigate = useNavigate();

  function getRandomProfilePicture() {
    const svgs = [logo, drop, paintbrush];
    const randomIndex = Math.floor(Math.random() * svgs.length);
    return svgs[randomIndex];
  }

  let retryCount = 0;

  async function handleGoogleResponse(response: unknown) {
    const jwt = (response as { credential: string }).credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    console.log("User:", payload);

    const profilePicture = getRandomProfilePicture();

    const newPlayer: Player = {
      playerName: payload.name,
      playerProfile: profilePicture,
    };

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

    const userExists = users.some((user) => user.email === payload.email);

    if (userExists) {
      console.log("User already exists.");
    } else {
      try {
        // Save user in DB
        await addUser(payload.name, profilePicture, payload.email);

        setPlayersList([...playersList, newPlayer]);
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    }

    // Add player to context
    setCurrentPlayer(newPlayer);

    navigate("/home");

    const currentUser = await getUserByEmail(payload.email);

    if (currentUser) {
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
