import styles from "../assets/css-modules/LeaderboardPage.module.css";
import PodiumUserRow from "../components/podiumComponents/PodiumUserRow";
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
    await updateGamePlayers(gamePlayers);
  })();

  return (
    <div>
      <PageHeader>Results</PageHeader>
      {playerPoints.length > 0 ? (
        <div className={styles.usersContainer}>
          {playerPoints
            .slice()
            .sort((a, b) => b[1] - a[1])
            .map((user) => (
              <PodiumUserRow
                key={user[0]._id}
                user={user[0]}
                points={user[1]}
              />
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
