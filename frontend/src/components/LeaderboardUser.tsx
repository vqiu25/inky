import { User } from "../types/types";
import styles from "../assets/LeaderboardUser.module.css";

interface LeaderboardUserProps {
  leaderboardUser: User;
}

export default function LeaderboardUser({
  leaderboardUser,
}: LeaderboardUserProps) {
  return (
    <>
      <span className={styles.container}>
        <span className={`${styles.pill} ${styles.user}`}>
          <div className={styles.pictureBorder}>
            <img
              className={styles.profilePicture}
              src={leaderboardUser.profilePicture}
            />
          </div>
          <div>{leaderboardUser.username}</div>
        </span>
        <div className={`${styles.pill} ${styles.points}`}>
          {leaderboardUser.totalPoints}
        </div>
      </span>
    </>
  );
}
