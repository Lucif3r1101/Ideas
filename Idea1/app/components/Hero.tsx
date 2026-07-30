"use client";

import { useEffect, useRef, useState } from "react";
import Workspace from "./Workspace";
import GameScene from "./GameScene";
import Expanded from "./Expanded";
import WaitlistForm from "./WaitlistForm";
import { PROJECTS } from "@/lib/projects";
import styles from "./hero.module.css";

export default function Hero() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(2); // 0 none · 1 question · 2 question + reply
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [open, setOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const project = PROJECTS[active];
  const t = project.theme;

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  function pick(i: number) {
    if (i === active) return;
    clearTimers();
    setActive(i);
    setStep(0);
    setRunning(false);
    timers.current.push(setTimeout(() => setStep(1), 260));
    timers.current.push(setTimeout(() => setStep(2), 1150));
  }

  function run() {
    if (running) return;
    setRunning(true);
    setRunKey((k) => k + 1);
    timers.current.push(setTimeout(() => setRunning(false), 1100));
  }

  return (
    <div
      className={styles.sky}
      style={
        {
          "--sky-top": t.skyTop,
          "--sky-bot": t.skyBot,
          "--brand": t.brand,
          "--l1": t.l1,
          "--l1-shadow": t.l1Shadow,
          "--l2": t.l2,
          "--l2-shadow": t.l2Shadow,
          "--lede": t.lede,
        } as React.CSSProperties
      }
    >
      <span className={styles.brand}>Tinker</span>

      <div className={styles.stage}>
        <div className={styles.copy}>
          <h1 className={styles.h1}>
            <span className={styles.l1}>Say it.</span>
            <span className={styles.l2}>Then build it.</span>
          </h1>

          <p className={styles.lede}>
            Your child describes a game and it appears. Then the real part
            starts. They change how it works, and go looking for the line that
            decides.
          </p>

          <div className={styles.form}>
            <WaitlistForm id="top" />
          </div>
        </div>

        <div className={styles.ws}>
          <Workspace
            active={active}
            project={project}
            step={step}
            running={running}
            runKey={runKey}
            onPick={pick}
            onRun={run}
            onExpand={() => setOpen(true)}
          />
        </div>
      </div>

      <div className={styles.world}>
        <GameScene key={project.id} variant={project.id} />
      </div>

      {open && <Expanded project={project} onClose={() => setOpen(false)} />}
    </div>
  );
}
