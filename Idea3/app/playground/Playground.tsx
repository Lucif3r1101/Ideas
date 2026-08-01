"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Phone from "../components/Phone";
import SplitBill from "../components/apps/SplitBill";
import HabitTracker from "../components/apps/HabitTracker";
import Countdown from "../components/apps/Countdown";
import WaitlistForm from "../components/WaitlistForm";
import { track } from "@/lib/analytics";
import styles from "./playground.module.css";

type Build = {
  id: string;
  chip: string;
  prompt: string;
  file: string;
  what: string;
  app: () => React.ReactElement;
};

const BUILDS: Build[] = [
  {
    id: "split",
    chip: "Split a bill",
    prompt: "an app to split the bill with my friends, with tip",
    file: "split.tsx",
    what: "Change the total, the tip or the headcount. It recalculates as you go.",
    app: () => <SplitBill />,
  },
  {
    id: "habit",
    chip: "Track a habit",
    prompt: "something to track if i went to the gym this week",
    file: "habit.tsx",
    what: "Tap any day to tick it off. The streak and the bar both react.",
    app: () => <HabitTracker />,
  },
  {
    id: "count",
    chip: "Count down",
    prompt: "a countdown to my exam that updates every second",
    file: "countdown.tsx",
    what: "Watch the seconds. It is a real timer, not a picture of one.",
    app: () => <Countdown />,
  },
];

type Phase = "idle" | "typing" | "building" | "ready";

export default function Playground() {
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
    void track("playground_build", { app: b.id });

    b.prompt.split("").forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setTyped(b.prompt.slice(0, i + 1)), 24 * i)
      );
    });
    const t = 24 * b.prompt.length;
    timers.current.push(setTimeout(() => setPhase("building"), t + 240));
    timers.current.push(setTimeout(() => setPhase("ready"), t + 1450));
  }

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          Thumb
        </Link>
        <span className={styles.tag}>Playground</span>
      </nav>

      <header className={styles.head}>
        <h1 className={styles.h1}>Try it here.</h1>
        <p className={styles.sub}>
          Pick something, watch it get written, then actually use it. Works the
          same on the phone in your hand as it does on this screen.
        </p>
      </header>

      <div className={styles.split}>
        {/* ------ left: ask ------ */}
        <section className={styles.ask}>
          <span className={styles.label}>1 · Ask for an app</span>

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

          <div className={styles.composer}>
            <div className={styles.bubble}>
              {typed || (
                <span className={styles.ghost}>tap one above to start…</span>
              )}
              {(phase === "typing" || phase === "idle") && (
                <i className={styles.caret} />
              )}
            </div>
            <span
              className={`${styles.send} ${phase !== "idle" ? styles.sendOn : ""}`}
              aria-hidden="true"
            >
              ↑
            </span>
          </div>

          {phase === "ready" && (
            <div className={styles.built}>
              <span className={styles.label} style={{ marginTop: 0 }}>
                2 · It made this
              </span>
              <div className={styles.fileRow}>
                <span className={styles.dot} />
                <code className={styles.file}>{build.file}</code>
                <span className={styles.done}>ready</span>
              </div>
              <p className={styles.what}>{build.what}</p>
            </div>
          )}
        </section>

        {/* ------ right: the phone ------ */}
        <section className={styles.preview}>
          <div className={styles.glow} aria-hidden="true" />
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
                      {phase === "typing"
                        ? "reading what you want"
                        : "your app appears here"}
                    </p>
                  </>
                )}
              </div>
            )}
          </Phone>
        </section>
      </div>

      <section className={styles.ask2}>
        <h2 className={styles.h2}>Want to build your own?</h2>
        <p className={styles.sub2}>
          Tell us what you&rsquo;d make first. We&rsquo;ll let you know when it
          opens.
        </p>
        <div className={styles.form}>
          <WaitlistForm id="playground" page="mobile-playground" />
        </div>
      </section>

      <footer className={styles.foot}>
        <Link href="/" className={styles.footLink}>
          Back to the site
        </Link>
      </footer>
    </main>
  );
}
