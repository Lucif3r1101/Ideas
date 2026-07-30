import Link from "next/link";
import styles from "./thanks.module.css";

export default function Thanks() {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <span className={styles.badge} aria-hidden="true">
          🎉
        </span>

        <h1 className={styles.h1}>You&rsquo;re on the list!</h1>
        <p className={styles.body}>
          We&rsquo;ll email you once, when access opens. Nothing in between.
        </p>

        <Link className={styles.back} href="/">
          Back to the site
        </Link>
      </div>
    </main>
  );
}
