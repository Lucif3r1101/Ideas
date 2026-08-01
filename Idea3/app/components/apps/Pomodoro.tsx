"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./apps.module.css";

const WORK = 25 * 60;
const BREAK = 5 * 60;

/** A timer that actually runs, pauses and switches mode. Real interval work. */
export default function Pomodoro() {
  const [left, setLeft] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [rounds, setRounds] = useState(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;

    tick.current = setInterval(() => {
      setLeft((s) => {
        if (s > 1) return s - 1;
        // session finished, flip mode
        setOnBreak((b) => {
          const next = !b;
          if (!b) setRounds((r) => r + 1);
          setLeft(next ? BREAK : WORK);
          return next;
        });
        return 0;
      });
    }, 1000);

    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  const total = onBreak ? BREAK : WORK;
  const pct = ((total - left) / total) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className={styles.app}>
      <h1 className={styles.appTitle}>{onBreak ? "Break" : "Focus"}</h1>

      <div className={styles.ring}>
        <svg viewBox="0 0 120 120" className={styles.ringSvg}>
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#e8eaf2"
            strokeWidth="9"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={onBreak ? "#2fb47e" : "#5b3df5"}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * (1 - pct / 100)}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.9s linear" }}
          />
        </svg>
        <div className={styles.ringMid}>
          <span className={styles.ringTime}>
            {mm}:{ss}
          </span>
          <span className={styles.ringSub}>
            {rounds} round{rounds === 1 ? "" : "s"} done
          </span>
        </div>
      </div>

      <div className={styles.timerBtns}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "Pause" : left === total ? "Start" : "Resume"}
        </button>
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => {
            setRunning(false);
            setOnBreak(false);
            setLeft(WORK);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
