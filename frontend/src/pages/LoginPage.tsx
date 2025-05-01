import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayersContext } from "../context/PlayersContextProvider";
import { UsersContext } from "../context/UsersContextProvider";
import { Player } from "../types/types";
import styles from "../assets/LoginPage.module.css";
import logo from "../assets/logo.svg";
import GoogleSignInButton from "../components/GoogleSignInButton";

const LoginPage = () => {
  const { playersList, setPlayersList, setCurrentPlayer } =
    useContext(PlayersContext)!;
  const { usersLoading, users, addUser } = useContext(UsersContext)!;
  const navigate = useNavigate();

  async function handleGoogleResponse(response: unknown) {
    const jwt = (response as { credential: string }).credential;
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    console.log("User:", payload);

    const newPlayer: Player = {
      playerName: payload.name,
      playerProfile: payload.picture,
    };

    if (usersLoading) {
      return null;
    }

    const userExists = users.some((user) => user.email === payload.email);

    if (userExists) {
      console.log("User already exists.");
      setCurrentPlayer(newPlayer);
      navigate("/home");
    } else {
      try {
        // Save user in DB
        await addUser(payload.name, payload.picture, payload.email);

        // Add player to context
        setCurrentPlayer(newPlayer);
        setPlayersList([...playersList, newPlayer]);

        navigate("/home");
      } catch (error) {
        console.error("Failed to create user:", error);
      }
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
