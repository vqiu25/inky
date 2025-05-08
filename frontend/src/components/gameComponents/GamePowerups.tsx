import React, { useState, useEffect, JSX } from "react";
import ReactDOM from "react-dom";
import styles from "../../assets/css-modules/GamePowerups.module.css";
import Button from "./Button";
import {
  powerupConfigs,
  PowerupConfig,
} from "../../config/GamePowerupsConfig.ts";

export default function GamePowerups(): JSX.Element {
  const [selected, setSelected] = useState<PowerupConfig | null>(null);

  return (
    <>
      <div className={styles.powerupArea}>
        <div className={styles.powerupGrid}>
          {powerupConfigs.map((powerup, idx) => (
            <Button
              key={idx}
              imageSrc={powerup.imageSrc}
              alt={powerup.alt}
              onClick={() => setSelected(powerup)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <Overlay
          powerup={selected}
          onClose={() => {
            selected.handler();
            setSelected(null);
          }}
        />
      )}
    </>
  );
}

interface OverlayProps {
  powerup: PowerupConfig;
  onClose: () => void;
}

function Overlay({ powerup, onClose }: OverlayProps): React.ReactPortal {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const autoHide = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(autoHide);
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 250);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return ReactDOM.createPortal(
    <div
      className={`${styles.overlay} ${visible ? styles.fadeIn : styles.fadeOut}`}
    >
      <div className={styles.sparkles}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={styles.sparkle}
            style={
              { "--i": i, "--color": powerup.colour } as React.CSSProperties
            }
          />
        ))}
      </div>
      <img
        src={powerup.imageSrc}
        alt={powerup.alt}
        className={`${styles.overlayImage} ${visible ? styles.popIn : styles.popOut}`}
      />
    </div>,
    document.body,
  );
}
