"use client";

import { useEffect, useRef, useState } from "react";
import Phone from "./Phone";
import SplitBill from "./apps/SplitBill";
import HabitTracker from "./apps/HabitTracker";
import Countdown from "./apps/Countdown";
import { track } from "@/lib/analytics";
import styles from "./builder.module.css";

type Build = {
  id: string;
  chip: string;
  prompt: string;
  app: () => React.ReactElement;
};

const BUILDS: Build[] = [
  {
    id: "split",
    chip: "Split a bill",
    prompt: "an app to split the bill with my friends, with tip",
    app: () => <SplitBill />,
  },
  {
    id: "habit",
    chip: "Track a habit",
    prompt: "something to track if i went to the gym this week",
    app: () => <HabitTracker />,
  },
  {
    id: "count",
    chip: "Count down",
    prompt: "a countdown to my exam that updates every second",
    app: () => <Countdown />,
  },
];

type Phase = "idle" | "typing" | "building" | "ready";

export default function Builder() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [build, setBuild] = useState<Build>(BUILDS[0]);
  const [typed, setTyped] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start(b: Build) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBuild(b);
    setTyped("");
    setPhase("typing");

    void track("builder_start", { app: b.id });

    b.prompt.split("").forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setTyped(b.prompt.slice(0, i + 1)), 26 * i)
      );
    });
    const typedFor = 26 * b.prompt.length;
    timers.current.push(setTimeout(() => setPhase("building"), typedFor + 260));
    timers.current.push(setTimeout(() => setPhase("ready"), typedFor + 1500));
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.phoneCol}>
        <Phone>
          {phase === "ready" ? (
            build.app()
          ) : (
            <div className={styles.blank}>
              {phase === "building" ? (
                <>
                  <span className={styles.dots}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <p>writing it</p>
                </>
              ) : (
                <>
                  <span className={styles.blankIcon} aria-hidden="true" />
                  <p>
                    {phase === "idle"
                      ? "nothing here yet"
                      : "reading what you want"}
                  </p>
                </>
              )}
            </div>
          )}
        </Phone>

        {/* the keyboard is the whole point, so it stays visible */}
        <div className={styles.keyboard}>
          <div className={styles.inputRow}>
            <span className={styles.typed}>
              {typed || (
                <span className={styles.placeholder}>
                  tell it what to make…
                </span>
              )}
              {(phase === "typing" || phase === "idle") && (
                <i className={styles.caret} />
              )}
            </span>
            <span
              className={`${styles.send} ${
                phase !== "idle" ? styles.sendOn : ""
              }`}
              aria-hidden="true"
            >
              ↑
            </span>
          </div>
          <div className={styles.keys} aria-hidden="true">
            {["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row, r) => (
              <div key={r} className={styles.keyRow}>
                {row.split("").map((k) => (
                  <span key={k} className={styles.key}>
                    {k}
                  </span>
                ))}
              </div>
            ))}
            <div className={styles.keyRow}>
              <span className={`${styles.key} ${styles.space}`} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.side}>
        <span className={styles.sideHead}>Try one</span>
        <div className={styles.chips}>
          {BUILDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`${styles.chip} ${
                build.id === b.id && phase !== "idle" ? styles.chipOn : ""
              }`}
              onClick={() => start(b)}
            >
              {b.chip}
            </button>
          ))}
        </div>

        {phase === "ready" && (
          <div className={styles.note}>
            <p className={styles.noteP}>
              That app is real. Change the numbers, tap the days, it all works.
            </p>
            <p className={styles.noteSmall}>
              Built and running without ever touching a laptop.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
