import WaitlistForm from "./components/WaitlistForm";
import Hero from "./components/Hero";
import styles from "./page.module.css";

const GROWTH = [
  {
    when: "Week one",
    what: "A dog that runs",
    how: "They describe it, it appears. The only skill needed is knowing what they want.",
  },
  {
    when: "Month two",
    what: "Score, levels, sound",
    how: "They're asking for specific changes and reading the code to find where things live.",
  },
  {
    when: "Month six",
    what: "Editing it themselves",
    how: "Typing changes directly, breaking things, fixing them. That's programming.",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <Hero />

      <section className={styles.growth}>
        <h2 className={styles.h2}>
          It gets harder on purpose.
        </h2>
        <p className={styles.sub}>
          The point isn&rsquo;t one game. It&rsquo;s that they keep needing to
          understand a bit more to get what they want next.
        </p>

        <ol className={styles.track}>
          {GROWTH.map((g) => (
            <li key={g.when} className={styles.stop}>
              <span className={styles.when}>{g.when}</span>
              <h3 className={styles.what}>{g.what}</h3>
              <p className={styles.how}>{g.how}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.below}>
        <div className={styles.notes}>
          <p>
            <b>Built for 8 to 14.</b>{" "}
            <span>
              Younger ones do better with someone sitting alongside for the first
              few goes.
            </span>
          </p>
          <p>
            <b>It doesn&rsquo;t do it all for them.</b>{" "}
            <span>
              It writes the first version, then stops. Every change after that
              has to come from them.
            </span>
          </p>
          <p>
            <b>You hold the account.</b>{" "}
            <span>
              Projects are private, and there is no chat with strangers.
            </span>
          </p>
          <p>
            <b>Real code, not blocks.</b>{" "}
            <span>
              The same languages they&rsquo;ll meet in a classroom, not a toy
              syntax they have to unlearn later.
            </span>
          </p>
        </div>

        <div className={styles.last}>
          <h2 className={styles.h2Last}>Want them on the early list?</h2>
          <p className={styles.lastSub}>
            Tell us what your kid would make. We read every one.
          </p>
          <div className={styles.lastForm}>
            <WaitlistForm id="bottom" />
          </div>
        </div>

        <footer className={styles.footer}>
          <span className={styles.footMark}>Tinker</span>
          <span>Not out yet. That&rsquo;s what the list is for.</span>
        </footer>
      </section>
    </main>
  );
}
