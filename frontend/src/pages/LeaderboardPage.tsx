import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UsersContextProvider";
import LeaderboardUser from "../components/LeaderboardUser";
import styles from "../assets/LeaderboardPage.module.css";

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { users } = useContext(UsersContext)!;

  return (
    <>
      <div className={styles.page}>
        <span className={styles.titleContainer}>
          <div className={styles.left}>
            <button
              className={`${styles.backButton} material-icons ${styles.arrow}`}
              onClick={() => navigate("/home")}
            >
              arrow_back
            </button>
          </div>
          <h1>Leaderboard</h1>
          <div className={styles.right}></div>
        </span>
        <div className={styles.usersContainer}>
          {users
            .slice()
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((user) => (
              <LeaderboardUser key={user._id} leaderboardUser={user} />
            ))}
        </div>
      </div>
    </>
  );
}
