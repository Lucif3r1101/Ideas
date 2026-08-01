"use client";

import { useState } from "react";
import styles from "./trip.module.css";

type Person = { id: number; name: string; colour: string };
type Spend = { id: number; what: string; amount: number; paidBy: number };

const COLOURS = ["#5b3df5", "#ff5c39", "#0e9f6e", "#c2410c", "#7c3aed"];

const PEOPLE: Person[] = [
  { id: 1, name: "You", colour: COLOURS[0] },
  { id: 2, name: "Aman", colour: COLOURS[1] },
  { id: 3, name: "Sara", colour: COLOURS[2] },
];

const SEED: Spend[] = [
  { id: 1, what: "Hotel, 2 nights", amount: 6400, paidBy: 1 },
  { id: 2, what: "Petrol", amount: 2200, paidBy: 2 },
  { id: 3, what: "Dinner", amount: 1850, paidBy: 3 },
  { id: 4, what: "Museum tickets", amount: 900, paidBy: 1 },
];

type Screen = "spends" | "add" | "balance" | "people";

/**
 * Four screens sharing one state, with a tab bar and a push screen on top.
 * This is what a real app looks like, rather than one widget on one page.
 */
export default function TripApp() {
  const [screen, setScreen] = useState<Screen>("spends");
  const [people, setPeople] = useState<Person[]>(PEOPLE);
  const [spends, setSpends] = useState<Spend[]>(SEED);

  // add-screen fields
  const [what, setWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(1);
  const [newName, setNewName] = useState("");

  const total = spends.reduce((a, b) => a + b.amount, 0);
  const share = people.length ? total / people.length : 0;

  const balances = people.map((p) => {
    const paid = spends
      .filter((s) => s.paidBy === p.id)
      .reduce((a, b) => a + b.amount, 0);
    return { ...p, paid, net: paid - share };
  });

  function addSpend() {
    const n = Number(amount);
    if (!what.trim() || !Number.isFinite(n) || n <= 0) return;
    setSpends((xs) => [
      { id: Date.now(), what: what.trim(), amount: n, paidBy },
      ...xs,
    ]);
    setWhat("");
    setAmount("");
    setScreen("spends");
  }

  function addPerson() {
    if (!newName.trim()) return;
    setPeople((ps) => [
      ...ps,
      {
        id: Date.now(),
        name: newName.trim(),
        colour: COLOURS[ps.length % COLOURS.length],
      },
    ]);
    setNewName("");
  }

  const nameOf = (id: number) =>
    people.find((p) => p.id === id)?.name ?? "Someone";

  return (
    <div className={styles.app}>
      {/* ---------------- top bar, changes per screen ---------------- */}
      <header className={styles.bar}>
        {screen === "add" ? (
          <>
            <button
              type="button"
              className={styles.back}
              onClick={() => setScreen("spends")}
              aria-label="Back"
            >
              ‹
            </button>
            <h1 className={styles.barTitle}>New expense</h1>
          </>
        ) : (
          <>
            <h1 className={styles.barTitle}>
              {screen === "spends"
                ? "Goa trip"
                : screen === "balance"
                  ? "Who owes what"
                  : "People"}
            </h1>
            {screen === "spends" && (
              <span className={styles.barTotal}>
                ₹{total.toLocaleString("en-IN")}
              </span>
            )}
          </>
        )}
      </header>

      {/* ---------------- screens ---------------- */}
      <div className={styles.body}>
        {screen === "spends" && (
          <>
            <ul className={styles.list}>
              {spends.map((s) => {
                const p = people.find((x) => x.id === s.paidBy);
                return (
                  <li key={s.id} className={styles.row}>
                    <span
                      className={styles.avatar}
                      style={{ background: p?.colour ?? "#999" }}
                    >
                      {(p?.name ?? "?")[0]}
                    </span>
                    <span className={styles.rowMain}>
                      <span className={styles.rowWhat}>{s.what}</span>
                      <span className={styles.rowWho}>
                        {nameOf(s.paidBy)} paid
                      </span>
                    </span>
                    <span className={styles.rowAmt}>
                      ₹{s.amount.toLocaleString("en-IN")}
                    </span>
                  </li>
                );
              })}
              {spends.length === 0 && (
                <li className={styles.blank}>Nothing spent yet</li>
              )}
            </ul>
            <button
              type="button"
              className={styles.fab}
              onClick={() => setScreen("add")}
              aria-label="Add an expense"
            >
              +
            </button>
          </>
        )}

        {screen === "add" && (
          <div className={styles.form}>
            <label className={styles.lab}>What was it?</label>
            <input
              className={styles.input}
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="Boat ride"
            />

            <label className={styles.lab}>How much?</label>
            <div className={styles.amtRow}>
              <span className={styles.rupee}>₹</span>
              <input
                className={styles.amt}
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
              />
            </div>

            <label className={styles.lab}>Who paid?</label>
            <div className={styles.whoRow}>
              {people.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.whoChip} ${
                    paidBy === p.id ? styles.whoOn : ""
                  }`}
                  onClick={() => setPaidBy(p.id)}
                  style={
                    paidBy === p.id
                      ? { background: p.colour, borderColor: p.colour }
                      : undefined
                  }
                >
                  {p.name}
                </button>
              ))}
            </div>

            <button type="button" className={styles.save} onClick={addSpend}>
              Add it
            </button>
          </div>
        )}

        {screen === "balance" && (
          <div className={styles.balance}>
            <div className={styles.shareBox}>
              <span className={styles.shareLab}>Each person&rsquo;s share</span>
              <span className={styles.shareVal}>
                ₹{share.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>

            {balances.map((b) => (
              <div key={b.id} className={styles.balRow}>
                <span
                  className={styles.avatar}
                  style={{ background: b.colour }}
                >
                  {b.name[0]}
                </span>
                <span className={styles.balName}>{b.name}</span>
                <span
                  className={`${styles.balNet} ${
                    b.net >= 0 ? styles.up : styles.down
                  }`}
                >
                  {b.net >= 0 ? "gets back " : "owes "}₹
                  {Math.abs(b.net).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        {screen === "people" && (
          <div className={styles.people}>
            {people.map((p) => (
              <div key={p.id} className={styles.pRow}>
                <span className={styles.avatar} style={{ background: p.colour }}>
                  {p.name[0]}
                </span>
                <span className={styles.pName}>{p.name}</span>
                {p.id !== 1 && (
                  <button
                    type="button"
                    className={styles.pX}
                    onClick={() =>
                      setPeople((ps) => ps.filter((x) => x.id !== p.id))
                    }
                    aria-label={`Remove ${p.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <div className={styles.addPerson}>
              <input
                className={styles.input}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPerson()}
                placeholder="Add someone"
              />
              <button type="button" className={styles.addBtn} onClick={addPerson}>
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- tab bar ---------------- */}
      {screen !== "add" && (
        <nav className={styles.tabs}>
          {(
            [
              ["spends", "Spends"],
              ["balance", "Balance"],
              ["people", "People"],
            ] as [Screen, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`${styles.tab} ${screen === id ? styles.tabOn : ""}`}
              onClick={() => setScreen(id)}
              aria-current={screen === id}
            >
              <span className={styles.tabDot} />
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
