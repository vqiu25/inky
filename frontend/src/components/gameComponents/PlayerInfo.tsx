import ProfilePicture from "../profileComponents/ProfilePicture";
import styles from "../../assets/css-modules/PlayerInfo.module.css";

export default function PlayerInfo({
  username,
  profilePicture,
  points,
  isCurrentUser,
  hasGuessedWord,
}: {
  username: string;
  profilePicture: string;
  points: number;
  isCurrentUser: boolean;
  hasGuessedWord: boolean;
}) {
  return (
    <div
      className={`${styles.playerInfoContainer} ${hasGuessedWord ? styles.guessedWord : ""}`}
    >
      <ProfilePicture
        src={profilePicture}
        pictureBorderSize={{
          width: "1.8rem",
          height: "1.8rem",
          padding: "0.6rem",
          backgroundColor: "#1b1c24",
          border: "2px solid #9da3cb",
          borderRadius: "50%",
          overflow: "hidden",
          marginRight: "0.625rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        profilePictureSize={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
        username={username}
      />
      <div className={styles.playerInfoSubContainer}>
        <div className={styles.playerInfoUsername}>
          {username} {isCurrentUser ? " (You)" : ""}
        </div>
        <div className={styles.playerInfoPoints}>
          {points} {points === 1 ? "Point" : "Points"}
        </div>
      </div>
    </div>
  );
}
