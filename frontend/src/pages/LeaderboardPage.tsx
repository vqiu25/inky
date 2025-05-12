import { useContext, useEffect } from "react";
import { UsersContext } from "../context/UsersContext";
import styles from "../assets/css-modules/LeaderboardPage.module.css";
import LeaderboardUserRow from "../components/leaderboardComponents/LeaderboardUserRow";
import PageHeader from "../components/layoutComponents/PageHeader";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";

export default function LeaderboardPage() {
  const { usersList, usersLoading, refreshUsers } = useContext(UsersContext)!;

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return (
    <div>
      <PageHeader>Leaderboard</PageHeader>
      {usersList.length > 0 || usersLoading ? (
        <div className={styles.usersContainer}>
          {usersList
            .slice()
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((user) => (
              <LeaderboardUserRow key={user._id} user={user} />
            ))}
        </div>
      ) : (
        <div className={spinnerStyles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
