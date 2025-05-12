import LeaderboardUser from "../leaderboardComponents/LeaderboardUser";
import UserInfo from "../userInfoComponents/UserInfo";
import { User } from "../../types/types";
import InfoPill from "../userInfoComponents/InfoPill";
import { useContext } from "react";
import { UsersContext } from "../../context/UsersContext";

export default function PodiumUserRow({
  user,
  points,
}: {
  user: User;
  points: number;
}) {
  const { currentUser } = useContext(UsersContext)!;
  const isCurrentUser = user._id === currentUser?._id;

  return (
    <LeaderboardUser>
      <InfoPill
        children={<UserInfo user={user} isCurrent={isCurrentUser} />}
        className="darkBackground"
        style={{ minWidth: "450px", paddingInlineEnd: "10px" }}
      />
      <InfoPill
        children={points}
        className="lightBackground"
        style={{
          justifyContent: "center",
          marginLeft: "10px",
          minWidth: "180px",
          paddingInline: "10px",
        }}
      />
    </LeaderboardUser>
  );
}
