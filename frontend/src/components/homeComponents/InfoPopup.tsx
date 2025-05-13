import { useEffect, useState } from "react";
import styles from "../../assets/css-modules/InfoPopup.module.css";
import closeIcon from "../../assets/images/close.svg";
import nextArrow from "../../assets/images/next-arrow.svg";
import backArrow from "../../assets/images/back-arrow.svg";

const cardModules = import.meta.glob<{ default: string }>(
  "../../assets/images/infoCards/*.svg",
  { eager: true },
);

const cards = Object.values(cardModules).map((m) => m.default);

interface InfoPopupProps {
  onClose: () => void;
}

export default function InfoPopup({ onClose }: InfoPopupProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setClosing(true);
  }

  const prevCard = () =>
    setCurrent((c) => (c - 1 + cards.length) % cards.length);
  const nextCard = () => setCurrent((c) => (c + 1) % cards.length);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(onClose, 200);
    return () => clearTimeout(t);
  }, [closing, onClose]);

  const overlayClass = closing
    ? styles.overlayOut
    : visible
      ? styles.overlayIn
      : styles.overlayOut;

  const popupClass = closing
    ? styles.popupOut
    : visible
      ? styles.popupIn
      : styles.popupOut;

  return (
    <div className={`${styles.overlay} ${overlayClass}`}>
      <div className={`${styles.popup} ${popupClass}`}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
        >
          <img src={closeIcon} alt="" className={styles.closeIcon} />
        </button>
        <h2 className={styles.title}>How to Play</h2>
        <div className={styles.carouselWrapper}>
          <button
            onClick={prevCard}
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="Previous card"
          >
            <img src={backArrow} alt="" className={styles.navIcon} />
          </button>

          <div className={styles.cardContainer}>
            <img
              src={cards[current]}
              alt={`card ${current + 1}`}
              className={styles.cardImage}
            />
          </div>

          <button
            onClick={nextCard}
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="Next card"
          >
            <img src={nextArrow} alt="" className={styles.navIcon} />
          </button>
        </div>
        <div className={styles.indicators}>
          {cards.map((_, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${
                i === current ? styles.active : ""
              }`}
              onClick={() => setCurrent(i)}
              aria-label={`Show card ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
