import { useContext } from "react";
import styles from "../../assets/css-modules/DrawerDisplay.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import ProfilePicture from "../profileComponents/ProfilePicture";

export default function DrawerDisplay() {
  const { currentDrawer } = useContext(GameStateContext)!;

  return (
    <div className={styles.outerContainer}>
      <div className={styles.text}>
        Current Drawer: {currentDrawer?.username}
      </div>
      <div className={styles.imageContainer}>
        <ProfilePicture
          src={currentDrawer?.profilePicture ?? ""}
          pictureBorderSize={{ height: "40px", aspectRatio: "1/1" }}
          profilePictureSize={{
            height: "25px",
            aspectRatio: "1/1",
          }}
        />
      </div>
    </div>
  );
}
