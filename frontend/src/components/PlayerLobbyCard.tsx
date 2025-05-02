import { User } from "../types/types";

type PlayerLobbyCardProps = {
  user: User;
  isCurrent: boolean;
};

export default function PlayerLobbyCard({
  user,
  isCurrent,
}: PlayerLobbyCardProps) {
  return (
    <span>
      <img src={user.profilePicture} alt={`${user.username}'s profile`} />
      <div>
        {user.username}
        {isCurrent ? " (You)" : ""}
      </div>
    </span>
  );
}
