import { useContext } from "react";
import styles from "../../assets/css-modules/GamePlayerList.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import PlayerInfo from "./PlayerInfo";

export default function GamePlayerList() {
  const { lobbyPlayers } = useContext(GameStateContext)!;

  return (
    <div className={styles.playerList}>
      {lobbyPlayers.map((player, index) => (
        <PlayerInfo
          key={index}
          id={player._id}
          username={player.username}
          profilePicture={player.profilePicture}
        />
      ))}
    </div>
  );
}
