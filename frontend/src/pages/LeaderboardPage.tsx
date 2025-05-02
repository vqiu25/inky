import { useContext } from "react";
import { UsersContext } from "../context/UsersContextProvider";
import styles from "../assets/css-modules/LeaderboardPage.module.css";
import LeaderboardUserRow from "../components/LeaderboardUserRow";
import PageHeader from "../components/PageHeader";

export default function LeaderboardPage() {
  const { users } = useContext(UsersContext)!;

  return (
    <div>
      <PageHeader>Leaderboard</PageHeader>
      <div className={styles.usersContainer}>
        {users
          .slice()
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((user) => (
            <LeaderboardUserRow key={user._id} user={user} />
          ))}
      </div>
    </div>
  );
}
