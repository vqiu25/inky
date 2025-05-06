import LeaderboardUser from "./LeaderboardUser";
import UserInfo from "../userInfoComponents/UserInfo";
import { User } from "../../types/types";
import InfoPill from "../userInfoComponents/InfoPill";

export default function LeaderboardUserRow({ user }: { user: User }) {
  return (
    <LeaderboardUser>
      <InfoPill
        children={<UserInfo user={user} />}
        className="darkBackground"
        style={{ minWidth: "450px", paddingInlineEnd: "10px" }}
      />
      <InfoPill
        children={user.totalPoints}
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
