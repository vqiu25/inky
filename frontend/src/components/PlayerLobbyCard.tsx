import { Player } from "../types/types";

export default function PlayerLobbyCard({ playerProfile, playerName }: Player) {
  return (
    <>
      <span>
        <img src={playerProfile} />
        <div>{playerName}</div>
      </span>
    </>
  );
}
