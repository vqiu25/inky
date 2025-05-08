import styles from "../../assets/css-modules/GameStatusBar.module.css";
import Timer from "./Timer";

export default function GameStatusBar() {
  return (
    <>
      <div className={styles.statusBar}>
        <Timer />
      </div>
    </>
  );
}
