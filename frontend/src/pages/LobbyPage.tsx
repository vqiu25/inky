import { useContext } from "react";
import PlayerLobbyCard from "../components/PlayerLobbyCard";
import PlayersContext from "../context/PlayersContextProvider";

export default function LobbyPage() {
  const { playersList } = useContext(PlayersContext)!;

  return (
    <>
      <div>
        {playersList.map((player) => (
          <PlayerLobbyCard
            key={player.playerName}
            playerProfile={player.playerProfile}
            playerName={player.playerName}
          />
        ))}
      </div>
      <button>Enter Game</button>
    </>
  );
}
