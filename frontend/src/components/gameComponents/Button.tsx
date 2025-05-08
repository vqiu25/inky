import styles from "../../assets/css-modules/Button.module.css";

type ButtonProps = {
  imageSrc: string;
  alt?: string;
  onClick?: () => void;
};

export default function Button({ imageSrc, alt = "", onClick }: ButtonProps) {
  return (
    <button className={styles.circleButton} onClick={onClick}>
      <img src={imageSrc} alt={alt} className={styles.image} />
    </button>
  );
}
