"use client";

import { useState } from "react";
import styles from "./apps.module.css";

type Item = { id: number; what: string; amount: number };

const SEED: Item[] = [
  { id: 1, what: "Chai + samosa", amount: 60 },
  { id: 2, what: "Auto to office", amount: 140 },
  { id: 3, what: "Groceries", amount: 820 },
];

const QUICK = ["Chai", "Lunch", "Auto", "Recharge"];

/** List state, add and remove. The kind of thing that needs a real data model. */
export default function Expenses() {
  const [items, setItems] = useState<Item[]>(SEED);
  const [what, setWhat] = useState("");
  const [amount, setAmount] = useState("");

  const total = items.reduce((a, b) => a + b.amount, 0);

  function add() {
    const n = Number(amount);
    if (!what.trim() || !Number.isFinite(n) || n <= 0) return;
    setItems((xs) => [{ id: Date.now(), what: what.trim(), amount: n }, ...xs]);
    setWhat("");
    setAmount("");
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.appTitle}>Today</h1>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Spent</span>
        <span className={styles.totalVal}>
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>

      <div className={styles.addRow}>
        <input
          className={styles.addWhat}
          placeholder="What on?"
          value={what}
          onChange={(e) => setWhat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <input
          className={styles.addAmt}
          placeholder="₹"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className={styles.addBtn} type="button" onClick={add}>
          +
        </button>
      </div>

      <div className={styles.quick}>
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            className={styles.quickChip}
            onClick={() => setWhat(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <ul className={styles.items}>
        {items.map((it) => (
          <li key={it.id} className={styles.item}>
            <span className={styles.itemWhat}>{it.what}</span>
            <span className={styles.itemAmt}>₹{it.amount}</span>
            <button
              type="button"
              className={styles.itemX}
              onClick={() => setItems((xs) => xs.filter((x) => x.id !== it.id))}
              aria-label={`Remove ${it.what}`}
            >
              ×
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className={styles.empty}>Nothing yet today</li>
        )}
      </ul>
    </div>
  );
}
