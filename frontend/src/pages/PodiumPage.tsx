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
  const { playerStates: playerStates } = useContext(GameStateContext)!;
  const currentUser = useCurrentUser();

  const sortedPoints = [...playerStates].sort((a, b) => b.points - a.points);

  useEffect(() => {
    if (!currentUser) return;
    const syncCurrent = async () => {
      for (const user of sortedPoints) {
        if (user.user._id === currentUser._id) {
          await updateGamePlayer(user.user);
          break;
        }
      }
    };
    syncCurrent();
  }, [currentUser, sortedPoints, updateGamePlayer]);

  const topThree = sortedPoints.slice(0, 3);
  const nextThree = sortedPoints.slice(3, 6);

  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
  };

  return (
    <div className={styles.container}>
      <PageHeader>Game Finished!</PageHeader>
      <div className={styles.content}>
        {sortedPoints.length === 0 ? (
          <div
            className={spinnerStyles.spinnerContainer}
            data-testid="loading-spinner"
          >
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Top-3 Podium */}
            <div className={styles.topThree}>
              {topThree.map((player, idx) => {
                const place = idx + 1;
                return (
                  <div
                    key={player.user._id}
                    className={`${styles.card} ${styles[`place${place}`]}`}
                  >
                    <div className={styles.userWrapper}>
                      <PodiumUser user={player.user} isWinner={place === 1} />
                    </div>
                    <div className={styles.bar}>
                      <div className={styles.placeLabel}>{ordinal(place)}</div>
                      <div className={styles.pointsValue}>{player.points}</div>
                      <div className={styles.pointsText}>Points</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4th–6th without bars */}
            {nextThree.length > 0 && (
              <div className={styles.bottomGroup}>
                {nextThree.map((player, idx) => {
                  const place = idx + 4;
                  return (
                    <div key={player.user._id} className={styles.bottomUser}>
                      <div className={styles.bottomPill}>{ordinal(place)}</div>
                      <div className={styles.bottomPill}>
                        <span className={styles.pillNumber}>
                          {player.points}
                        </span>
                        <span className={styles.pillText}>points</span>
                      </div>
                      <PodiumUser user={player.user} isWinner={false} />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
