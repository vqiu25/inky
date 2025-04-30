import { useContext } from "react";
import { AppContext } from "../AppContextProvider";
import PlayerLobbyCard from "../components/PlayerLobbyCard";

export default function LobbyPage() {
  const context = useContext(AppContext);

  // To handle the | null type
  if (!context) {
    return <div>Loading...</div>;
  }

  const { playersList } = context;

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
