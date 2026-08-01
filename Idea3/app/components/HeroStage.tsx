"use client";

import { useEffect, useState } from "react";
import Phone from "./Phone";
import TripApp from "./apps/TripApp";
import styles from "./hero-stage.module.css";

/** Real prompts, floated around the phone so the input is visible, not implied. */
const NOTES = [
  { text: "split what we spent in goa", cls: "n1", delay: 300 },
  { text: "track my gym week", cls: "n2", delay: 700 },
  { text: "countdown to my exam", cls: "n3", delay: 1100 },
];

export default function HeroStage() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const ids = NOTES.map((n, i) =>
      setTimeout(() => setShown((s) => Math.max(s, i + 1)), n.delay)
    );
    return () => ids.forEach(clearTimeout);
  }, []);

  return (
    <div className={styles.stage}>
      <div className={styles.mesh} aria-hidden="true" />

      {NOTES.map((n, i) => (
        <span
          key={n.cls}
          className={`${styles.note} ${styles[n.cls]} ${
            shown > i ? styles.noteIn : ""
          }`}
          aria-hidden="true"
        >
          {n.text}
        </span>
      ))}

      <div className={styles.tilt}>
        <Phone>
          <TripApp />
        </Phone>
      </div>

      <p className={styles.caption}>
        <span className={styles.live} aria-hidden="true" />
        Four screens, all working. Tap the tabs.
      </p>
    </div>
  );
}
