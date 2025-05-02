import { CSSProperties } from "react";
import styles from "../assets/css-modules/User.module.css";

interface ProfilePictureProps {
  src: string;
  pictureBorderSize: CSSProperties;
  profilePictureSize: CSSProperties;
}

export default function ProfilePicture({
  src,
  pictureBorderSize,
  profilePictureSize,
}: ProfilePictureProps) {
  return (
    <div className={styles.pictureBorder} style={pictureBorderSize}>
      <img src={src} style={profilePictureSize} />
    </div>
  );
}
