import { User } from "../types/types";
import styles from "../assets/css-modules/User.module.css";
import ProfilePicture from "./ProfilePicture";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <span className={styles.userInfoContainer}>
      <ProfilePicture
        src={user.profilePicture}
        pictureBorderSize={{ width: "50px", height: "50px" }}
        profilePictureSize={{
          width: "35px",
          height: "35px",
        }}
      ></ProfilePicture>
      <div>{user.username}</div>
    </span>
  );
}
