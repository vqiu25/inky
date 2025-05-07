import { User } from "../../types/types";
import styles from "../../assets/css-modules/User.module.css";
import ProfilePicture from "../profileComponents/ProfilePicture";

interface UserInfoProps {
  user: User;
  isCurrent?: boolean;
}

export default function UserInfo({ user, isCurrent }: UserInfoProps) {
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
      <div>
        {user.username} {isCurrent ? " (You)" : ""}
      </div>
    </span>
  );
}
