import React from "react";
import styles from "../../assets/css-modules/Button.module.css";

export type ButtonProps = {
  imageSrc: string;
  tooltipText?: string;
  onClick?: () => void;
  disabled?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  imageSrc,
  tooltipText,
  onClick,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
}: ButtonProps) {
  return (
    <button
      className={styles.circleButton}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={tooltipText}
    >
      <img src={imageSrc} className={styles.image} alt={tooltipText ?? ""} />
    </button>
  );
}
