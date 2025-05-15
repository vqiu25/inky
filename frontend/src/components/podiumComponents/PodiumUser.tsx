import { User } from "../../types/types";
import styles from "../../assets/css-modules/PodiumUser.module.css";
import CrownIcon from "../../assets/images/crown.svg";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function PodiumUser({
  user,
  isWinner = false,
}: {
  user: User;
  isWinner: boolean;
}) {
  const currentUser = useCurrentUser();
  const isCurrentUser = user._id === currentUser?._id;

  return (
    <div className={styles.podiumUserWrapper} data-testid="podium-user">
      <div className={styles.podiumUser}>
        {isWinner && (
          <img src={CrownIcon} alt="Winner" className={styles.crown} />
        )}
        <div className={styles.avatarContainer}>
          <img
            src={user.profilePicture}
            alt="User Avatar"
            className={styles.avatar}
          />
        </div>
      </div>
      <div className={styles.username}>
        {user.username}
        {isCurrentUser ? " (You)" : ""}
      </div>
    </div>
  );
}
