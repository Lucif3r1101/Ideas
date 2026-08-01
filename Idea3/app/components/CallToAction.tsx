import WaitlistForm from "./WaitlistForm";
import styles from "./cta.module.css";

/**
 * One component, three looks. The old version repeated an identical dark box
 * on every page, which made the site feel like one page copied three times.
 */
export default function CallToAction({
  title,
  sub,
  page,
  id,
  tone = "dark",
}: {
  title: string;
  sub: React.ReactNode;
  page: string;
  id: string;
  tone?: "dark" | "violet" | "quiet";
}) {
  return (
    <section className={`${styles.cta} ${styles[tone]}`}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.h2}>{title}</h2>
          <p className={styles.sub}>{sub}</p>
        </div>
        <div className={styles.form}>
          <WaitlistForm id={id} page={page} />
        </div>
      </div>
    </section>
  );
}
