import Link from "next/link";
import Phone from "./components/Phone";
import SplitBill from "./components/apps/SplitBill";
import WaitlistForm from "./components/WaitlistForm";
import styles from "./page.module.css";

const TRUTHS = [
  {
    n: "01",
    k: "No laptop, ever",
    v: "Writing it, running it, sharing it. All of it happens on the phone. There is no desktop version you are missing out on.",
  },
  {
    n: "02",
    k: "Nothing to install",
    v: "No terminal, no environment to set up, no downloads. Open it and start typing.",
  },
  {
    n: "03",
    k: "It runs where you made it",
    v: "Tap it and the thing works. Send the link to a friend and it works for them too.",
  },
  {
    n: "04",
    k: "Real code underneath",
    v: "Open it whenever you want to look. If you outgrow the phone one day, the project comes with you.",
  },
];

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Build from your phone</span>
            <h1 className={styles.h1}>
              You don&rsquo;t need a laptop
              <br />
              <span className={styles.mark}>to build software.</span>
            </h1>
            <p className={styles.lede}>
              Most people who want to make something have a phone and nothing
              else. So make it on the phone. Say what you want, watch it appear,
              use it straight away.
            </p>

            <div className={styles.actions}>
              <div className={styles.form}>
                <WaitlistForm id="top" page="mobile" />
              </div>
              <Link href="/playground" className={styles.tryLink}>
                or try one now
              </Link>
            </div>
          </div>

          <div className={styles.art}>
            <div className={styles.glow} aria-hidden="true" />
            <Phone>
              <SplitBill />
            </Phone>
            <p className={styles.artCaption}>
              A real app, running. Change the numbers.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.truths}>
        <div className={styles.truthsInner}>
          <h2 className={styles.h2}>How it actually works</h2>
          <ol className={styles.list}>
            {TRUTHS.map((t) => (
              <li key={t.n} className={styles.row}>
                <span className={styles.num}>{t.n}</span>
                <div>
                  <h3 className={styles.k}>{t.k}</h3>
                  <p className={styles.v}>{t.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.last}>
        <div className={styles.lastInner}>
          <h2 className={styles.h2Last}>What would you build first?</h2>
          <p className={styles.lastSub}>
            Tell us and we&rsquo;ll let you know the moment it opens.
          </p>
          <div className={styles.lastForm}>
            <WaitlistForm id="bottom" page="mobile" />
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footBrand}>Thumb</span>
        <span>Not out yet. That&rsquo;s what the list is for.</span>
      </footer>
    </main>
  );
}
