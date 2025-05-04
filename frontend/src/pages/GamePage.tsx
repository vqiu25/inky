import { useEffect, useRef } from "react";
import styles from "../assets/css-modules/GamePage.module.css";
import GameToolBar from "../components/GameToolBar";
import GamePowerups from "../components/GamePowerups";
import GameStatusBar from "../components/GameStatusBar";
import GamePlayerList from "../components/GamePlayerList";
import GameCanvasArea from "../components/GameCanvasArea";
import GameChat from "../components/GameChat";

export default function GamePage() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (el) {
      const width = window.innerWidth * 0.95;
      const height = (width * 9) / 16;

      if (height > window.innerHeight * 0.95) {
        const maxHeight = window.innerHeight * 0.95;
        const adjustedWidth = (maxHeight * 16) / 9;
        el.style.width = `${adjustedWidth}px`;
        el.style.height = `${maxHeight}px`;
      } else {
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
      }
    }
  }, []);

  return (
    <div ref={wrapperRef} className={styles.gameWrapper}>
      <div className={styles.gameGrid}>
        <GameStatusBar />

        <div className={styles.left}>
          <GamePlayerList />
          <GamePowerups />
        </div>

        <GameCanvasArea />
        <GameChat />
        <GameToolBar />
      </div>
    </div>
  );
}
