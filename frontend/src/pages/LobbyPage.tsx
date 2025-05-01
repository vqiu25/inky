import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PlayerLobbyCard from "../components/PlayerLobbyCard";
import PlayersContext from "../context/PlayersContextProvider";

export default function LobbyPage() {
  const navigate = useNavigate();
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
      <button onClick={() => navigate("/play")}>Enter Game</button>
    </>
  );
}
