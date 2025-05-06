import { ReactNode, CSSProperties } from "react";
import styles from "../../assets/css-modules/User.module.css";

interface InfoPillProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function InfoPill({
  children,
  style,
  className,
}: InfoPillProps) {
  return (
    <div
      className={`${styles.pill} ${className ? styles[className] : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
