"use client";

import { useEffect, useState } from "react";
import styles from "./apps.module.css";

const OPTIONS = [
  { label: "Exam", days: 12 },
  { label: "Birthday", days: 41 },
  { label: "Trip", days: 5 },
];

export default function Countdown() {
  const [pick, setPick] = useState(0);
  const [now, setNow] = useState(0);

  // tick, so the seconds actually move
  useEffect(() => {
    const id = setInterval(() => setNow((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const target = OPTIONS[pick];
  const totalSeconds = target.days * 86400 - now;
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div className={styles.app}>
      <h1 className={styles.appTitle}>Counting down</h1>

      <div className={styles.pills} style={{ marginBottom: 20 }}>
        {OPTIONS.map((o, i) => (
          <button
            key={o.label}
            type="button"
            className={`${styles.pill} ${pick === i ? styles.pillOn : ""}`}
            onClick={() => setPick(i)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className={styles.clock}>
        {[
          [d, "days"],
          [h, "hrs"],
          [m, "min"],
          [s, "sec"],
        ].map(([v, l]) => (
          <div key={l as string} className={styles.unit}>
            <span className={styles.unitNum}>
              {String(v).padStart(2, "0")}
            </span>
            <span className={styles.unitLabel}>{l}</span>
          </div>
        ))}
      </div>

      <p className={styles.until}>until your {target.label.toLowerCase()}</p>
    </div>
  );
}
