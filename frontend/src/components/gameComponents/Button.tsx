import styles from "../../assets/css-modules/Button.module.css";

type ButtonProps = {
  imageSrc: string;
  alt?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  imageSrc,
  alt = "",
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={styles.circleButton}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={imageSrc} alt={alt} className={styles.image} />
    </button>
  );
}
