import { CSSProperties } from "react";
import styles from "../../assets/css-modules/User.module.css";

interface ProfilePictureProps {
  src: string;
  pictureBorderSize: CSSProperties;
  profilePictureSize: CSSProperties;
  username: string;
}

export default function ProfilePicture({
  src,
  pictureBorderSize,
  profilePictureSize,
  username,
}: ProfilePictureProps) {
  return (
    <div className={styles.pictureBorder} style={pictureBorderSize}>
      <img
        src={src}
        style={profilePictureSize}
        className={styles.image}
        alt={`${username}'s profile picture`}
      />
    </div>
  );
}
