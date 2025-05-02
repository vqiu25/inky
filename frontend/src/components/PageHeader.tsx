import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css-modules/PageHeader.module.css";

interface PageHeaderProps {
  children: ReactNode;
  backTo?: string; // This is optional and it defaults to "/home"
}

export default function PageHeader({
  children,
  backTo = "/home",
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <span className={styles.titleContainer}>
      <div className={styles.left}>
        <button
          className={`${styles.backButton} material-icons ${styles.arrow}`}
          onClick={() => navigate(backTo)}
        >
          arrow_back
        </button>
      </div>
      <h1>{children}</h1>
      <div className={styles.right}></div>
    </span>
  );
}
