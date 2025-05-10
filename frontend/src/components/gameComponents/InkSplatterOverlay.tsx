import ReactDOM from "react-dom";
import logo from "../../assets/images/logo.svg";
import styles from "../../assets/css-modules/InkSplatterOverlay.module.css";

interface InkSplatterOverlayProps {
  fading: boolean;
}

export default function InkSplatterOverlay({
  fading,
}: InkSplatterOverlayProps) {
  const wrapperClass = `${styles.overlay} ${fading ? styles.overlayFade : ""}`;

  return ReactDOM.createPortal(
    <div className={wrapperClass}>
      <div className={styles.container}>
        <img
          src={logo}
          alt="Ink splatter"
          className={`${styles.image} ${styles.top}`}
        />
        <img
          src={logo}
          alt="Ink splatter"
          className={`${styles.image} ${styles.bottomLeft}`}
        />
        <img
          src={logo}
          alt="Ink splatter"
          className={`${styles.image} ${styles.bottomRight}`}
        />
      </div>
    </div>,
    document.body,
  );
}
