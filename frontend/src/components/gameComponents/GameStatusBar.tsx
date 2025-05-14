import { useContext, useEffect, useState } from "react";
import { socket } from "../../services/socket";
import { GameStateContext } from "../../context/GameStateContext";
import styles from "../../assets/css-modules/GameStatusBar.module.css";
import homeIcon from "../../assets/images/home.svg";
import clockIcon from "../../assets/images/clock.svg";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import WordReveal from "./WordReveal";
import { UsersContext } from "../../context/UsersContext";
import { User } from "../../types/types";

export default function GameStatusBar() {
  const navigate = useNavigate();
  const { round, setRound } = useContext(GameStateContext)!;
  const [isDrawer, setIsDrawer] = useState(false);
  const { currentDrawer } = useContext(GameStateContext)!;
  const { currentUser } = useContext(UsersContext)!;
  const [revealWord, setRevealWord] = useState(false);

  useEffect(() => {
    const handleNewTurn = (state: { round: number }) => {
      setRound(state.round);
      setIsDrawer(currentUser?._id === currentDrawer?._id);
      setRevealWord(false);
    };
    socket.on("new-turn", handleNewTurn);
    return () => {
      socket.off("new-turn", handleNewTurn);
    };
  }, [currentDrawer?._id, currentUser?._id, setRound]);

  useEffect(() => {
    socket.on("word-guessed", (player: User) => {
      console.log("Guessed");
      if (player._id === currentUser?._id) {
        console.log("You guessed the word!");
        setRevealWord(true);
      }
    });
  });

  function handleLeaveGame() {
    socket.emit("leave-game", currentUser?._id);
    socket.emit("player-leave", currentUser);
    navigate("/home");
  }

  useEffect(() => {
    window.addEventListener("popstate", handleLeaveGame);
    window.addEventListener("beforeunload", handleLeaveGame);

    return () => {
      setTimeout(() => {
        window.removeEventListener("popstate", handleLeaveGame);
        window.removeEventListener("beforeunload", handleLeaveGame);
      }, 0);
    };
  });

  return (
    <div className={styles.statusBar}>
      <div className={styles.statusBarLeft}>
        <img
          src={homeIcon}
          alt="Home"
          className={styles.buttonIcon}
          onClick={() => handleLeaveGame()}
        />
        <div className={styles.roundPill}>Round {round} / 3</div>
      </div>

      <div className={styles.statusBarCenter}>
        <WordReveal isDrawer={isDrawer} revealWord={revealWord} />
      </div>

      <div className={styles.roundPill}>
        <img src={clockIcon} alt="Clock" className={styles.icon} />
        <Timer />
      </div>
    </div>
  );
}
