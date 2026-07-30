"use client";

import GameScene from "./GameScene";
import { PROJECTS, type Project } from "@/lib/projects";
import styles from "./workspace.module.css";

export default function Workspace({
  active,
  project,
  step,
  running,
  runKey,
  onPick,
  onRun,
  onExpand,
}: {
  active: number;
  project: Project;
  step: number;
  running: boolean;
  runKey: number;
  onPick: (i: number) => void;
  onRun: () => void;
  onExpand: () => void;
}) {
  return (
    <div className={styles.frame}>
      <div className={styles.bar}>
        <span className={styles.lights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.who}>Maya, 9</span>
        <span className={styles.saved}>saved</span>
      </div>

      <div className={styles.body}>
        <aside className={styles.rail}>
          <span className={styles.railHead}>Her projects</span>
          <ul className={styles.projects}>
            {PROJECTS.map((proj, i) => (
              <li key={proj.id}>
                <button
                  type="button"
                  onClick={() => onPick(i)}
                  aria-pressed={i === active}
                  className={`${styles.project} ${styles[proj.tint]} ${
                    i === active ? styles.on : ""
                  }`}
                >
                  <span className={styles.chip} aria-hidden="true" />
                  {proj.name}
                </button>
              </li>
            ))}
          </ul>
          <span className={styles.newBtn}>+ new</span>
        </aside>

        <div className={styles.middle}>
          <button
            type="button"
            className={styles.screen}
            onClick={onExpand}
            aria-label={`Open ${project.name} full size`}
          >
            <GameScene
              key={`${project.id}-${runKey}`}
              compact
              variant={project.id}
            />
            {running ? (
              <span className={styles.flash}>running…</span>
            ) : (
              <span className={styles.expand}>
                <span className={styles.expandIcon} aria-hidden="true">
                  ⤢
                </span>
                see it bigger
              </span>
            )}
          </button>

          <div className={styles.code}>
            <span className={styles.codeHead}>
              {project.file}
              <span className={styles.lang}>{project.lang}</span>
            </span>
            <pre className={styles.pre}>
              <code>
                <span className={styles.ln}>33</span>
                <span className={styles.dim}>{project.open}</span>
                {"\n"}
                <span className={`${styles.ln} ${styles.lnOn}`}>34</span>
                <span className={styles.hot}>
                  {project.hot.label}
                  <b>{project.hot.value}</b>
                </span>
                <span className={styles.point}>← {project.note}</span>
                {"\n"}
                <span className={styles.ln}>35</span>
                <span className={styles.dim}>{project.close}</span>
              </code>
            </pre>
          </div>
        </div>

        <aside className={styles.chat}>
          <span className={styles.railHead}>What she asked</span>

          <p
            className={`${styles.said} ${
              step >= 1 ? styles.inView : styles.hidden
            }`}
          >
            {project.ask}
          </p>

          {step >= 2 ? (
            <p className={`${styles.reply} ${styles.inView}`}>{project.reply}</p>
          ) : (
            <p className={`${styles.reply} ${styles.typing}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </p>
          )}

          <button
            type="button"
            className={`${styles.run} ${running ? styles.runOn : ""}`}
            onClick={onRun}
          >
            {running ? "running…" : "▶ run it"}
          </button>
        </aside>
      </div>
    </div>
  );
}
