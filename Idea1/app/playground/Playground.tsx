"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MiniGame, { type Knobs } from "../components/MiniGame";
import WaitlistForm from "../components/WaitlistForm";
import type { Variant } from "../components/GameScene";
import { track } from "@/lib/analytics";
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
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start(b: Build) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBuild(b);
    setKnobs(b.knobs);
    setScore(0);
    setTweaks(0);
    fired.current = new Set();
    setPhase("building");
    setTyped("");

    void track("playground_build", { game: b.id, file: b.file });

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

    // one event per knob per game, dragging fires onChange constantly
    if (!fired.current.has(key)) {
      fired.current.add(key);
      void track("playground_tweak", { game: build.id, knob: key });
    }
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

        <div className={styles.split}>
          {/* left: what was asked for, and what to change */}
          <aside className={styles.left}>
            <span className={styles.leftHead}>Ask for it</span>

            <div className={styles.prompt}>
              {phase === "idle" ? (
                <span className={styles.promptIdle}>
                  pick a game above and watch it get built
                </span>
              ) : (
                <span className={styles.typed}>
                  {typed}
                  {phase === "building" && <i className={styles.caret} />}
                </span>
              )}
            </div>

            {phase === "ready" && (
              <>
                <div className={styles.replyRow}>
                  <span className={styles.replyDot} aria-hidden="true" />
                  <p className={styles.reply}>
                    Built it. Everything below is a real value in{" "}
                    <code>{build.file}</code>, change one and it happens straight
                    away.
                  </p>
                </div>

                <div className={styles.knobList}>
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

                <button
                  type="button"
                  className={styles.reset}
                  onClick={() => setKnobs(build.knobs)}
                >
                  put it back
                </button>
              </>
            )}
          </aside>

          {/* right: the thing itself */}
          <div className={styles.right}>
            <div className={styles.console}>
              <div className={styles.consoleBar}>
                <span className={styles.lights} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.file}>
                  {phase === "idle" ? "nothing running" : build.file}
                </span>
                {phase === "ready" && (
                  <span className={styles.scoreTag}>{score}</span>
                )}
              </div>

              <div className={styles.screen}>
                {phase === "idle" && (
                  <div className={styles.empty}>
                    <span className={styles.emptyIcon} aria-hidden="true">
                      &#9654;
                    </span>
                    <p>Pick a game to build it</p>
                  </div>
                )}
                {phase === "building" && (
                  <div className={styles.building}>
                    <span className={styles.dots}>
                      <i />
                      <i />
                      <i />
                    </span>
                    writing the code
                  </div>
                )}
                {phase === "ready" && (
                  <MiniGame variant={build.id} knobs={knobs} onScore={setScore} />
                )}
              </div>
            </div>

            {phase === "ready" && <p className={styles.hint}>{build.hint}</p>}
          </div>
        </div>

        {showAsk && (
          <section className={styles.ask}>
            <h2 className={styles.askH}>You just changed code, and it worked.</h2>
            <p className={styles.askSub}>
              That is the bit kids get hooked on. The real thing lets them ask for
              anything, not drag four sliders.
            </p>
            <div className={styles.askForm}>
              <WaitlistForm
                id="playground"
                page="kids-playground"
                played
                tweaks={tweaks}
                score={score}
              />
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
