"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MiniGame, { type Knobs } from "../components/MiniGame";
import WaitlistForm from "../components/WaitlistForm";
import type { Variant } from "../components/GameScene";
import styles from "./playground.module.css";

type Build = {
  id: Variant;
  prompt: string;
  file: string;
  label: string;
  hint: string;
  knobs: Knobs;
};

const BUILDS: Build[] = [
  {
    id: "dog",
    prompt: "a game where my dog runs and collects coins",
    file: "dog.js",
    label: "dog game",
    hint: "Tap the game or press space to make him jump.",
    knobs: { jump: 9, speed: 3, coins: 4, gravity: 0.45 },
  },
  {
    id: "rocket",
    prompt: "a rocket flying past stars picking up crystals",
    file: "rocket.py",
    label: "space rocks",
    hint: "Tap or press space to boost upwards.",
    knobs: { jump: 11, speed: 4.5, coins: 6, gravity: 0.5 },
  },
  {
    id: "cat",
    prompt: "a cat running around catching fish",
    file: "cat.js",
    label: "cat maze",
    hint: "Tap or press space to pounce.",
    knobs: { jump: 8, speed: 3.5, coins: 5, gravity: 0.38 },
  },
];

const KNOBS: {
  key: keyof Knobs;
  name: string;
  code: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: "jump", name: "How high it jumps", code: "jumpPower", min: 5, max: 16, step: 1 },
  { key: "speed", name: "How fast it moves", code: "speed", min: 1, max: 9, step: 0.5 },
  { key: "coins", name: "How many to collect", code: "coinCount", min: 1, max: 12, step: 1 },
  { key: "gravity", name: "How heavy it feels", code: "gravity", min: 0.2, max: 0.9, step: 0.05 },
];

type Phase = "idle" | "building" | "ready";

export default function Playground() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [build, setBuild] = useState<Build>(BUILDS[0]);
  const [knobs, setKnobs] = useState<Knobs>(BUILDS[0].knobs);
  const [score, setScore] = useState(0);
  const [typed, setTyped] = useState("");
  const [tweaks, setTweaks] = useState(0);
  const [custom, setCustom] = useState("");
  const [noted, setNoted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start(b: Build) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBuild(b);
    setKnobs(b.knobs);
    setScore(0);
    setTweaks(0);
    setNoted(false);
    setPhase("building");
    setTyped("");

    // type the prompt out, then "build" it
    b.prompt.split("").forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setTyped(b.prompt.slice(0, i + 1)), 18 * i)
      );
    });
    timers.current.push(
      setTimeout(() => setPhase("ready"), 18 * b.prompt.length + 900)
    );
  }

  function change(key: keyof Knobs, value: number) {
    setKnobs((k) => ({ ...k, [key]: value }));
    setTweaks((n) => n + 1);
  }

  const showAsk = tweaks >= 3 || score >= 3;

  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <Link href="/" className={styles.brand}>
          Tinker
        </Link>
        <span className={styles.tag}>Playground</span>
      </header>

      <section className={styles.intro}>
        <h1 className={styles.h1}>Have a go yourself.</h1>
        <p className={styles.sub}>
          This is a cut down version of what a kid gets. Pick something to build,
          play it, then change the numbers and watch the game change. That last
          bit is the whole point.
        </p>
      </section>

      <section className={styles.picker}>
        <span className={styles.pickLabel}>Ask for a game</span>
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
              {b.prompt}
            </button>
          ))}
        </div>

        <div className={styles.customRow}>
          <input
            className={styles.customInput}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="or type your own idea"
            aria-label="Type your own game idea"
          />
          <button
            type="button"
            className={styles.customBtn}
            onClick={() => {
              setNoted(true);
              start(BUILDS[Math.floor(Math.random() * BUILDS.length)]);
            }}
            disabled={custom.trim().length < 3}
          >
            Build it
          </button>
        </div>
        {noted && (
          <p className={styles.honest}>
            The real thing builds whatever you ask for. This demo has three games
            ready to go, so we picked the closest one. Your idea is worth telling
            us about below.
          </p>
        )}
      </section>

      {phase !== "idle" && (
        <section className={styles.stage}>
          <div className={styles.promptBar}>
            <span className={styles.who}>you</span>
            <span className={styles.typed}>
              {typed}
              {phase === "building" && <i className={styles.caret} />}
            </span>
          </div>

          {phase === "building" ? (
            <div className={styles.building}>
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              building your game
            </div>
          ) : (
            <>
              <div className={styles.gameWrap}>
                <div className={styles.hud}>
                  <span className={styles.file}>{build.file}</span>
                  <span className={styles.score}>collected {score}</span>
                </div>
                <div className={styles.game}>
                  <MiniGame variant={build.id} knobs={knobs} onScore={setScore} />
                </div>
                <p className={styles.hint}>{build.hint}</p>
              </div>

              <div className={styles.knobs}>
                <h2 className={styles.knobsHead}>Now change it</h2>
                <p className={styles.knobsSub}>
                  These are real values in the file. Drag one and the game changes
                  straight away, nothing to save or reload.
                </p>

                {KNOBS.map((k) => (
                  <div key={k.key} className={styles.knob}>
                    <label className={styles.knobLabel} htmlFor={`k-${k.key}`}>
                      {k.name}
                      <code className={styles.knobCode}>
                        {k.code} = <b>{knobs[k.key]}</b>
                      </code>
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
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.reset}
                  onClick={() => setKnobs(build.knobs)}
                >
                  put it back
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {showAsk && (
        <section className={styles.ask}>
          <h2 className={styles.askH}>
            You just changed code and the game changed.
          </h2>
          <p className={styles.askSub}>
            That is the bit kids get hooked on. The real thing lets them ask for
            anything, not four sliders. Want your kid on the early list?
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
    </main>
  );
}
