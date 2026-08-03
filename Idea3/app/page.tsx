import Link from "next/link";
import WaitlistForm from "./components/WaitlistForm";
import HeroStage from "./components/HeroStage";
import CallToAction from "./components/CallToAction";
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
          </div>

          <div className={styles.stage}>
            <HeroStage />
          </div>

          <div className={styles.actions}>
            <div className={styles.form}>
              <WaitlistForm id="top" page="mobile" />
            </div>
            <Link href="/playground" className={styles.tryLink}>
              or try one now
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.truths}>
        <div className={styles.truthsInner}>
          <div className={styles.truthsHead}>
            <h2 className={styles.h2}>How it actually works</h2>
            <Link href="/how" className={styles.deeper}>
              The technical version →
            </Link>
          </div>
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

      <div className={styles.lastWrap}>
        <CallToAction
          id="bottom"
          page="mobile"
          tone="violet"
          title="What would you build first?"
          sub="Tell us and we'll let you know the moment it opens. One email, nothing else."
        />
      </div>

    </main>
  );
}
