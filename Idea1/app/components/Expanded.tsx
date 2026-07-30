"use client";

import { useEffect, useRef } from "react";
import GameScene from "./GameScene";
import type { Project } from "@/lib/projects";
import styles from "./expanded.module.css";

export default function Expanded({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className={styles.scrim}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name}, full size`}
    >
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <span className={styles.chip} data-tint={project.tint} />
          <span className={styles.name}>{project.name}</span>
          <span className={styles.by}>made by Maya, 9</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.big}>
          <GameScene variant={project.id} />
        </div>

        <div className={styles.foot}>
          <div className={styles.line}>
            <span className={styles.file}>{project.file}</span>
            <code className={styles.code}>
              {project.hot.label.trim()}
              <b>{project.hot.value}</b>
            </code>
          </div>
          <p className={styles.hint}>
            One number. Change it and the whole game feels different.
          </p>
        </div>
      </div>
    </div>
  );
}
