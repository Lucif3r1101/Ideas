"use client";

import { useState } from "react";
import styles from "./apps.module.css";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitTracker() {
  const [done, setDone] = useState<boolean[]>([
    true,
    true,
    true,
    false,
    false,
    false,
    false,
  ]);

  function toggle(i: number) {
    setDone((d) => d.map((v, j) => (j === i ? !v : v)));
  }

  // longest run ending at the last ticked day
  let streak = 0;
  for (const d of done) {
    if (d) streak += 1;
    else break;
  }
  const total = done.filter(Boolean).length;

  return (
    <div className={styles.app}>
      <h1 className={styles.appTitle}>Gym, this week</h1>

      <div className={styles.streak}>
        <span className={styles.streakNum}>{streak}</span>
        <span className={styles.streakWord}>
          day{streak === 1 ? "" : "s"} in a row
        </span>
      </div>

      <div className={styles.week}>
        {DAYS.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.day} ${done[i] ? styles.dayOn : ""}`}
            onClick={() => toggle(i)}
            aria-pressed={done[i]}
            aria-label={`Day ${i + 1}`}
          >
            <span className={styles.dayLetter}>{d}</span>
            <span className={styles.dayDot} />
          </button>
        ))}
      </div>

      <p className={styles.hint}>Tap a day to tick it off</p>

      <div className={styles.bar}>
        <div
          className={styles.barFill}
          style={{ width: `${(total / 7) * 100}%` }}
        />
      </div>
      <p className={styles.barLabel}>
        {total} of 7 done
        {total >= 5 ? " · nice week" : total === 0 ? " · start today" : ""}
      </p>
    </div>
  );
}
