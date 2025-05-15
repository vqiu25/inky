import styles from "../assets/css-modules/PodiumPage.module.css";
import PodiumUser from "../components/podiumComponents/PodiumUser";
import PageHeader from "../components/layoutComponents/PageHeader";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import { useContext, useEffect } from "react";
import { GameStateContext } from "../context/GameStateContext";
import { UsersContext } from "../context/UsersContext";
import useCurrentUser from "../hooks/useCurrentUser";

export default function PodiumPage() {
  const { updateGamePlayer } = useContext(UsersContext)!;
  const { playerPoints } = useContext(GameStateContext)!;
  const gamePlayers = playerPoints.map((p) => p[0]);
  const currentUser = useCurrentUser();

  // Sort descending by points
  playerPoints.sort((a, b) => b[1] - a[1]);

  useEffect(() => {
    if (!currentUser) return;
    const syncCurrent = async () => {
      for (const player of gamePlayers) {
        if (player._id === currentUser._id) {
          await updateGamePlayer(player);
        }
      }
    };
    syncCurrent();
  }, [currentUser, gamePlayers, updateGamePlayer]);

  const podiumOrder = [1, 0, 2];

  return (
    <div className={styles.container}>
      <PageHeader>Game Finished!</PageHeader>
      <div className={styles.content}>
        {playerPoints.length > 0 ? (
          <>
            {/* Top-3 Podium */}
            <div className={styles.topThree}>
              {podiumOrder.map((i) => {
                const [user, pts] = playerPoints[i];
                const placeLabel = i === 0 ? "1st" : i === 1 ? "2nd" : "3rd";
                return (
                  <div
                    key={i}
                    className={`${styles.card} ${styles[`place${i + 1}`]}`}
                  >
                    <div className={styles.userWrapper}>
                      <PodiumUser user={user} isWinner={i === 0} />
                    </div>
                    <div className={styles.bar}>
                      <div className={styles.placeLabel}>{placeLabel}</div>
                      <div className={styles.pointsValue}>{pts}</div>
                      <div className={styles.pointsText}>Points</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4th–6th without bars */}
            {playerPoints.length > 3 && (
              <div className={styles.bottomGroup}>
                {playerPoints.slice(3, 6).map(([user, pts], idx) => (
                  <div key={idx} className={styles.bottomUser}>
                    <div className={styles.bottomPill}>{idx + 4}th</div>
                    <div className={styles.bottomPill}>
                      <span className={styles.pillNumber}>{pts}</span>
                      <span className={styles.pillText}>points</span>
                    </div>
                    <PodiumUser user={user} isWinner={false} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={spinnerStyles.spinnerContainer}>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
