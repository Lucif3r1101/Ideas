"use client";

import { useState } from "react";
import styles from "./apps.module.css";

const CARDS = [
  { q: "useEffect runs when?", a: "After render, and again when a dep changes" },
  { q: "What does useRef survive?", a: "Re-renders. Changing it does not re-render" },
  { q: "Why keys in a list?", a: "So React can tell which item is which between renders" },
  { q: "Server or client component by default?", a: "Server, in the app router" },
];

/** Flip animation plus deck state. Shows this can do more than forms. */
export default function Flashcards() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);

  const card = CARDS[i];

  function next(gotIt: boolean) {
    if (gotIt && !known.includes(i)) setKnown((k) => [...k, i]);
    setFlipped(false);
    setTimeout(() => setI((n) => (n + 1) % CARDS.length), 120);
  }

  return (
    <div className={styles.app}>
      <div className={styles.deckTop}>
        <h1 className={styles.appTitle} style={{ margin: 0 }}>
          React
        </h1>
        <span className={styles.deckCount}>
          {known.length}/{CARDS.length}
        </span>
      </div>

      <button
        type="button"
        className={`${styles.card} ${flipped ? styles.cardFlipped : ""}`}
        onClick={() => setFlipped((f) => !f)}
        aria-label="Flip the card"
      >
        <span className={styles.cardFace}>
          <span className={styles.cardHint}>question</span>
          {card.q}
        </span>
        <span className={`${styles.cardFace} ${styles.cardBack}`}>
          <span className={styles.cardHint}>answer</span>
          {card.a}
        </span>
      </button>

      <p className={styles.tapHint}>
        {flipped ? "Did you get it?" : "Tap the card to flip"}
      </p>

      <div className={styles.deckBtns}>
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => next(false)}
        >
          Again
        </button>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => next(true)}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
