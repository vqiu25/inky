import "../App.css";
import logo from "../assets/logo.svg";
import styles from "../assets/HomePage.module.css";
import { AppContext, AppContextType } from "../AppContextProvider";
import { useContext } from "react";

function HomePage() {
  const { isGuest } = useContext(AppContext) as AppContextType;

  return (
    <div className={styles.container}>
      <img src={logo} className={styles.logo}></img>
      <h1 className={styles.title}>Inky</h1>
      <button className={styles.button}>Play</button>
      {!isGuest && <button className={styles.button}>Profile</button>}
      <button className={styles.leaderboardButton}>Leaderboard</button>
    </div>
  );
}

export default HomePage;
