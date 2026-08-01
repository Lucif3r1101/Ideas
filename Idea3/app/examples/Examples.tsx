"use client";

import { useState } from "react";
import Phone from "../components/Phone";
import WaitlistForm from "../components/WaitlistForm";
import { DEMOS } from "@/lib/apps";
import { track } from "@/lib/analytics";
import styles from "./examples.module.css";

export default function Examples() {
  const [open, setOpen] = useState(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === open) ?? DEMOS[0];

  function pick(id: string) {
    setOpen(id);
    void track("example_open", { app: id });
  }

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.h1}>Six things, all running.</h1>
        <p className={styles.sub}>
          Every one of these was described in a sentence. None of them are
          screenshots, so open one and break it.
        </p>
      </header>

      <div className={styles.split}>
        <div className={styles.list}>
          {DEMOS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => pick(d.id)}
              className={`${styles.card} ${
                open === d.id ? styles.cardOn : ""
              }`}
              aria-pressed={open === d.id}
            >
              <div className={styles.cardTop}>
                <h2 className={styles.cardTitle}>{d.title}</h2>
                <span className={styles.shows}>{d.shows}</span>
              </div>
              <p className={styles.said}>&ldquo;{d.prompt}&rdquo;</p>
              <div className={styles.cardFoot}>
                <code className={styles.file}>{d.file}</code>
                <span className={styles.openIt}>
                  {open === d.id ? "running →" : "open it"}
                </span>
              </div>
            </button>
          ))}
        </div>

        <aside className={styles.phoneCol}>
          <div className={styles.sticky}>
            <div className={styles.glow} aria-hidden="true" />
            <Phone>{demo.app()}</Phone>
            <p className={styles.caption}>{demo.what}</p>
          </div>
        </aside>
      </div>

      <section className={styles.ask}>
        <h2 className={styles.h2}>What would yours be?</h2>
        <p className={styles.askSub}>
          Tell us and we&rsquo;ll let you know when it opens.
        </p>
        <div className={styles.form}>
          <WaitlistForm id="examples" page="mobile-examples" />
        </div>
      </section>
    </div>
  );
}
