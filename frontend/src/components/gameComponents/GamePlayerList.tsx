import { useContext } from "react";
import styles from "../../assets/css-modules/GamePlayerList.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import PlayerInfo from "./PlayerInfo";
import { UsersContext } from "../../context/UsersContext";

export default function GamePlayerList() {
  const { lobbyPlayers } = useContext(GameStateContext)!;
  const { playerPoints } = useContext(GameStateContext)!;
  const { currentUser } = useContext(UsersContext)!;

  // Sort players by points
  const sortedPlayers = [...lobbyPlayers].sort((a, b) => {
    const pointsA = playerPoints.find(([u]) => u._id === a._id)?.[1] ?? 0;
    const pointsB = playerPoints.find(([u]) => u._id === b._id)?.[1] ?? 0;
    return pointsB - pointsA;
  });

  return (
    <div className={styles.playerList}>
      {sortedPlayers.map((player) => (
        <PlayerInfo
          key={player._id}
          username={player.username}
          profilePicture={player.profilePicture}
          points={playerPoints.find(([u]) => u._id === player._id)?.[1] ?? 0}
          isCurrentUser={currentUser?._id === player._id}
        />
      ))}
    </div>
  );
}
