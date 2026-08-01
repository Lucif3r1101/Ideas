import Builder from "./components/Builder";
import WaitlistForm from "./components/WaitlistForm";
import styles from "./page.module.css";

const TRUTHS = [
  {
    k: "No laptop",
    v: "Everything happens on the phone. Writing it, running it, sharing it. There is no desktop version you are missing out on.",
  },
  {
    k: "No setup",
    v: "Nothing to install, no terminal, no environment to configure. Open it and start.",
  },
  {
    k: "It runs where you built it",
    v: "Tap the link and the thing works. Send it to someone and it works for them too.",
  },
  {
    k: "Real code underneath",
    v: "Open it any time. When you outgrow the phone, the project comes with you.",
  },
];

export default function Home() {
  return (
    <main>
      <nav className={styles.nav}>
        <span className={styles.brand}>Thumb</span>
        <span className={styles.tag}>Early access</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.copy}>
          <h1 className={styles.h1}>
            You don&rsquo;t need a laptop
            <br />
            <span className={styles.mark}>to build software.</span>
          </h1>
          <p className={styles.lede}>
            Most people who want to make something have a phone and nothing
            else. So build it on the phone. Type what you want, watch it appear,
            use it straight away.
          </p>

          <div className={styles.form}>
            <WaitlistForm id="top" page="mobile" />
          </div>
        </div>
      </section>

      <section className={styles.demo}>
        <Builder />
      </section>

      <section className={styles.truths}>
        <h2 className={styles.h2}>How it actually works</h2>
        <dl className={styles.list}>
          {TRUTHS.map((t) => (
            <div key={t.k} className={styles.row}>
              <dt className={styles.k}>{t.k}</dt>
              <dd className={styles.v}>{t.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.last}>
        <h2 className={styles.h2Last}>What would you build first?</h2>
        <p className={styles.lastSub}>
          Tell us and we&rsquo;ll let you know the moment it opens.
        </p>
        <div className={styles.lastForm}>
          <WaitlistForm id="bottom" page="mobile" />
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footBrand}>Thumb</span>
        <span>Not out yet. That&rsquo;s what the list is for.</span>
      </footer>
    </main>
  );
}
