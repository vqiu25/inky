import React, { useContext, useEffect } from "react";
import { socket } from "../../services/socket";
import { GameStateContext } from "../../context/GameStateContext";
import styles from "../../assets/css-modules/GameStatusBar.module.css";
import homeIcon from "../../assets/images/home.svg";
import clockIcon from "../../assets/images/clock.svg";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import WordReveal from "./WordReveal";

export default function GameStatusBar() {
  const navigate = useNavigate();
  const { round, setRound } = useContext(GameStateContext)!;

  useEffect(() => {
    const handleNewTurn = (state: { round: number }) => {
      setRound(state.round);
    };
    socket.on("new-turn", handleNewTurn);
    return () => {
      socket.off("new-turn", handleNewTurn);
    };
  }, [setRound]);

  return (
    <div className={styles.statusBar}>
      <div className={styles.statusBarLeft}>
        <img
          src={homeIcon}
          alt="Home"
          className={styles.buttonIcon}
          onClick={() => navigate("/home")}
        />
        <div className={styles.roundPill}>Round {round} / 3</div>
      </div>

      <div className={styles.statusBarCenter}>
        <WordReveal />
      </div>

      <div className={styles.roundPill}>
        <img src={clockIcon} alt="Clock" className={styles.icon} />
        <Timer />
      </div>
    </div>
  );
}
