import "../App.css";
import logo from "../assets/images/logo.svg";
import styles from "../assets/css-modules/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UsersContext } from "../context/UsersContextProvider";

function HomePage() {
  const navigate = useNavigate();
  const { refreshUsers } = useContext(UsersContext)!;

  function onClickLeaderboard() {
    refreshUsers();
    navigate("/leaderboard");
  }

  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo}></img>
      <h1 className={styles.title}>Inky</h1>
      <button className={styles.button} onClick={() => navigate("/lobby")}>
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
