import Link from "next/link";
import styles from "./site-footer.module.css";

const LINKS = [
  { href: "/playground", label: "Playground" },
  { href: "/examples", label: "Examples" },
  { href: "/how", label: "How it works" },
];

export default function SiteFooter() {
  return (
    <footer className={styles.foot}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>
            Thumb
          </Link>
          <p className={styles.line}>
            Build real apps on the phone you already have.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <span>Not out yet. That&rsquo;s what the list is for.</span>
      </div>
    </footer>
  );
}
