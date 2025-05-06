import styles from "../../assets/css-modules/GameCanvasArea.module.css";
import DrawerCanvas from "./DrawerCanvas";

export default function GameCanvasArea() {
  return (
    <div className={styles.canvasArea}>
      <DrawerCanvas />
    </div>
  );
}
