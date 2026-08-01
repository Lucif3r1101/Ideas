"use client";

import { useState } from "react";
import styles from "./apps.module.css";

/** A real, working bill splitter. Not a screenshot. */
export default function SplitBill() {
  const [total, setTotal] = useState(1240);
  const [people, setPeople] = useState(4);
  const [tip, setTip] = useState(10);

  const withTip = total * (1 + tip / 100);
  const each = people > 0 ? withTip / people : 0;

  return (
    <div className={styles.app}>
      <h1 className={styles.appTitle}>Split it</h1>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Bill total</span>
        <div className={styles.amountRow}>
          <span className={styles.currency}>₹</span>
          <input
            className={styles.amount}
            type="number"
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
      </label>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Tip</span>
        <div className={styles.pills}>
          {[0, 5, 10, 15].map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pill} ${tip === p ? styles.pillOn : ""}`}
              onClick={() => setTip(p)}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>People</span>
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => setPeople((n) => Math.max(1, n - 1))}
            aria-label="One fewer person"
          >
            −
          </button>
          <span className={styles.stepVal}>{people}</span>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => setPeople((n) => Math.min(20, n + 1))}
            aria-label="One more person"
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.result}>
        <span className={styles.resultLabel}>Each person pays</span>
        <span className={styles.resultVal}>
          ₹{each.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
        {tip > 0 && (
          <span className={styles.resultNote}>
            includes ₹{(withTip - total).toFixed(0)} tip
          </span>
        )}
      </div>
    </div>
  );
}
