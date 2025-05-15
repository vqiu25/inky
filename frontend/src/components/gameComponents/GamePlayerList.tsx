import { useContext } from "react";
import styles from "../../assets/css-modules/GamePlayerList.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import PlayerInfo from "./PlayerInfo";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function GamePlayerList() {
  const { lobbyPlayers } = useContext(GameStateContext)!;
  const { playerStates: playerStates } = useContext(GameStateContext)!;
  const currentUser = useCurrentUser();

  // Sort players by points
  const sortedPlayers = [...lobbyPlayers].sort((a, b) => {
    const pointsA =
      playerStates?.find((u) => u.user._id === a._id)?.points ?? 0;
    const pointsB =
      playerStates?.find((u) => u.user._id === b._id)?.points ?? 0;
    return pointsB - pointsA;
  });

  return (
    <div className={styles.playerList}>
      {sortedPlayers.map((player) => (
        <div
          data-testid="game-list-player"
          style={{ width: "100%" }}
          key={player._id}
        >
          <PlayerInfo
            key={player._id}
            username={player.username}
            profilePicture={player.profilePicture}
            points={
              playerStates.find((u) => u.user._id === player._id)?.points ?? 0
            }
            isCurrentUser={currentUser?._id === player._id}
            hasGuessedWord={
              playerStates.find((u) => u.user._id === player._id)
                ?.hasGuessedWord ?? false
            }
          />
        </div>
      ))}
    </div>
  );
}
