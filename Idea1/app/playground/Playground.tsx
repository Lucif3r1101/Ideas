"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MiniGame, { type Knobs } from "../components/MiniGame";
import WaitlistForm from "../components/WaitlistForm";
import type { Variant } from "../components/GameScene";
import styles from "./playground.module.css";

type Build = {
  id: Variant;
  short: string;
  prompt: string;
  file: string;
  hint: string;
  knobs: Knobs;
  sky: string;
  skyBot: string;
  ink: string;
};

const BUILDS: Build[] = [
  {
    id: "dog",
    short: "Dog and coins",
    prompt: "a game where my dog runs and collects coins",
    file: "dog.js",
    hint: "Tap the game or hit space to jump",
    knobs: { jump: 9, speed: 3, coins: 4, gravity: 0.45 },
    sky: "#7EC8FF",
    skyBot: "#D6F0FF",
    ink: "#10466F",
  },
  {
    id: "rocket",
    short: "Rocket in space",
    prompt: "a rocket flying past stars picking up crystals",
    file: "rocket.py",
    hint: "Tap or hit space to boost",
    knobs: { jump: 11, speed: 4.5, coins: 6, gravity: 0.5 },
    sky: "#2B1D5E",
    skyBot: "#6E4CB8",
    ink: "#E4D9FF",
  },
  {
    id: "cat",
    short: "Cat and fish",
    prompt: "a cat running around catching fish",
    file: "cat.js",
    hint: "Tap or hit space to pounce",
    knobs: { jump: 8, speed: 3.5, coins: 5, gravity: 0.38 },
    sky: "#FFB88C",
    skyBot: "#FFE8D2",
    ink: "#7A3418",
  },
];

const KNOBS: {
  key: keyof Knobs;
  name: string;
  code: string;
  min: number;
  max: number;
  step: number;
  tint: string;
}[] = [
  { key: "jump", name: "Jump height", code: "jumpPower", min: 5, max: 16, step: 1, tint: "sun" },
  { key: "speed", name: "Speed", code: "speed", min: 1, max: 9, step: 0.5, tint: "coral" },
  { key: "coins", name: "How many", code: "coinCount", min: 1, max: 12, step: 1, tint: "grape" },
  { key: "gravity", name: "Heaviness", code: "gravity", min: 0.2, max: 0.9, step: 0.05, tint: "mint" },
];

type Phase = "idle" | "building" | "ready";

export default function Playground() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [build, setBuild] = useState<Build>(BUILDS[0]);
  const [knobs, setKnobs] = useState<Knobs>(BUILDS[0].knobs);
  const [score, setScore] = useState(0);
  const [typed, setTyped] = useState("");
  const [tweaks, setTweaks] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start(b: Build) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBuild(b);
    setKnobs(b.knobs);
    setScore(0);
    setTweaks(0);
    setPhase("building");
    setTyped("");

    b.prompt.split("").forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setTyped(b.prompt.slice(0, i + 1)), 16 * i)
      );
    });
    timers.current.push(
      setTimeout(() => setPhase("ready"), 16 * b.prompt.length + 850)
    );
  }

  function change(key: keyof Knobs, value: number) {
    setKnobs((k) => ({ ...k, [key]: value }));
    setTweaks((n) => n + 1);
  }

  const showAsk = tweaks >= 3 || score >= 3;
  const dark = build.id === "rocket";

  return (
    <main
      className={`${styles.page} ${dark ? styles.onDark : ""}`}
      style={
        {
          "--pg-sky": build.sky,
          "--pg-sky-bot": build.skyBot,
          "--pg-ink": build.ink,
        } as React.CSSProperties
      }
    >
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          Tinker
        </Link>
        <span className={styles.tag}>Playground</span>
      </nav>

      <div className={styles.inner}>
        <header className={styles.head}>
          <h1 className={styles.h1}>Have a go yourself.</h1>
          <p className={styles.sub}>
            Pick a game, play it, then drag the sliders. They are the real values
            in the file, so the game changes as you move them.
          </p>
        </header>

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
              <span className={styles.chipDot} data-id={b.id} aria-hidden="true" />
              {b.short}
            </button>
          ))}
        </div>

        {phase === "idle" ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              ▶
            </span>
            <p>Pick one above to build it</p>
          </div>
        ) : (
          <div className={styles.console}>
            <div className={styles.promptBar}>
              <span className={styles.who}>asked for</span>
              <span className={styles.typed}>
                {typed}
                {phase === "building" && <i className={styles.caret} />}
              </span>
            </div>

            <div className={styles.screen}>
              {phase === "building" ? (
                <div className={styles.building}>
                  <span className={styles.dots}>
                    <i />
                    <i />
                    <i />
                  </span>
                  writing the code
                </div>
              ) : (
                <>
                  <MiniGame variant={build.id} knobs={knobs} onScore={setScore} />
                  <span className={styles.scoreTag}>{score}</span>
                </>
              )}
            </div>

            <div className={styles.bar}>
              <span className={styles.file}>{build.file}</span>
              <span className={styles.hint}>{build.hint}</span>
            </div>
          </div>
        )}

        {phase === "ready" && (
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelH}>Now change it</h2>
              <button
                type="button"
                className={styles.reset}
                onClick={() => setKnobs(build.knobs)}
              >
                put it back
              </button>
            </div>

            <div className={styles.knobGrid}>
              {KNOBS.map((k) => (
                <div key={k.key} className={`${styles.knob} ${styles[k.tint]}`}>
                  <label className={styles.knobTop} htmlFor={`k-${k.key}`}>
                    <span className={styles.knobName}>{k.name}</span>
                    <span className={styles.knobVal}>{knobs[k.key]}</span>
                  </label>
                  <input
                    id={`k-${k.key}`}
                    className={styles.range}
                    type="range"
                    min={k.min}
                    max={k.max}
                    step={k.step}
                    value={knobs[k.key]}
                    onChange={(e) => change(k.key, Number(e.target.value))}
                  />
                  <code className={styles.knobCode}>
                    {k.code} = {knobs[k.key]}
                  </code>
                </div>
              ))}
            </div>
          </section>
        )}

        {showAsk && (
          <section className={styles.ask}>
            <h2 className={styles.askH}>You just changed code, and it worked.</h2>
            <p className={styles.askSub}>
              That is the bit kids get hooked on. The real thing lets them ask for
              anything, not drag four sliders.
            </p>
            <div className={styles.askForm}>
              <WaitlistForm id="playground" page="kids-playground" />
            </div>
          </section>
        )}

        <footer className={styles.foot}>
          <Link href="/" className={styles.footLink}>
            Back to the site
          </Link>
        </footer>
      </div>
    </main>
  );
}
