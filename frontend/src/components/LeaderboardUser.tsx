import styles from "../assets/css-modules/LeaderboardUser.module.css";
import { ReactNode } from "react";

interface LeaderboardUserProps {
  children: ReactNode;
}

export default function LeaderboardUser({ children }: LeaderboardUserProps) {
  return <span className={styles.container}>{children}</span>;
}
