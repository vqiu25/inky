import styles from "../../assets/css-modules/GameCanvasArea.module.css";
import Canvas from "./Canvas";

export default function GameCanvasArea() {
  return (
    <div className={styles.canvasArea}>
      <Canvas />
    </div>
  );
}
