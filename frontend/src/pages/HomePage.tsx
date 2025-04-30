import "../App.css";
import logo from "../assets/logo.svg";
import styles from "../assets/HomePage.module.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo}></img>
      <h1 className={styles.title}>Inky</h1>
      <button className={styles.button} onClick={() => navigate("/lobby")}>
        Play
      </button>
      <button className={styles.button}>Profile</button>
      <button className={styles.leaderboardButton}>Leaderboard</button>
    </div>
  );
}

export default HomePage;
