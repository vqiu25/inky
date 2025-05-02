import "../App.css";
import logo from "../assets/images/logo.svg";
import styles from "../assets/css-modules/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UsersContext } from "../context/UsersContextProvider";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const { refreshUsers, getUserByEmail } = useContext(UsersContext)!;

  function onClickLeaderboard() {
    refreshUsers();
    navigate("/leaderboard");
  }

  async function onClickPlay() {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const email = JSON.parse(storedUser).email;
      const currentUser = await getUserByEmail(email);
      if (currentUser) {
        const res = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser._id}`,
          {
            lobby: 1,
          },
        );
        if (res.status === 200) {
          console.log(`User ${currentUser.username} joined the lobby`);
        } else {
          console.error(`Failed to join lobby: ${res}`);
        }
      }
    }
    navigate("/lobby");
  }

  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo}></img>
      <h1 className={styles.title}>Inky</h1>
      <button className={styles.button} onClick={() => onClickPlay()}>
        Play
      </button>
      <button className={styles.button} onClick={() => navigate("/profile")}>
        Profile
      </button>
      <button
        className={styles.leaderboardButton}
        onClick={() => onClickLeaderboard()}
      >
        Leaderboard
      </button>
    </div>
  );
}

export default HomePage;
