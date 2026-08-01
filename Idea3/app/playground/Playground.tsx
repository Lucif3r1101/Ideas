"use client";

import { useEffect, useRef, useState } from "react";
import Phone from "../components/Phone";
import CallToAction from "../components/CallToAction";
import { DEMOS, type Demo } from "@/lib/apps";
import { track } from "@/lib/analytics";
import styles from "./playground.module.css";

type Phase = "idle" | "typing" | "building" | "ready";

export default function Playground() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [build, setBuild] = useState<Demo>(DEMOS[0]);
  const [typed, setTyped] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function start(b: Demo) {
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
            {DEMOS.map((b) => (
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
                <span className={styles.done}>
                  {build.screens > 1 ? `${build.screens} screens` : "ready"}
                </span>
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

      <div className={styles.ctaWrap}>
        <CallToAction
          id="playground"
          page="mobile-playground"
          tone="dark"
          title="Want to build your own?"
          sub="That was three taps. The real thing takes whatever you type."
        />
      </div>

    </main>
  );
}
