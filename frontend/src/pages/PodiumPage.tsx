import styles from "../assets/css-modules/LeaderboardPage.module.css";
import LeaderboardUserRow from "../components/leaderboardComponents/LeaderboardUserRow";
import PageHeader from "../components/layoutComponents/PageHeader";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import { useContext } from "react";
import { GameStateContext } from "../context/GameStateContext";
import { UsersContext } from "../context/UsersContext";

export default function PodiumPage() {
  const { updateGamePlayers } = useContext(UsersContext)!;
  const { playerPoints } = useContext(GameStateContext)!;
  const gamePlayers = playerPoints.map((player) => player[0]);

  (async () => {
    console.log(gamePlayers);
    await updateGamePlayers(gamePlayers);
  })();

  return (
    <div>
      <PageHeader>Results</PageHeader>
      {gamePlayers.length > 0 ? (
        <div className={styles.usersContainer}>
          {gamePlayers
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
