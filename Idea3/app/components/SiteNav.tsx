"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-nav.module.css";

const LINKS = [
  { href: "/playground", label: "Playground" },
  { href: "/examples", label: "Examples" },
  { href: "/how", label: "How it works" },
];

export default function SiteNav() {
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          Thumb
        </Link>

        <div className={styles.links}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${
                path === l.href ? styles.linkOn : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/playground" className={styles.cta}>
          Try it
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </nav>
  );
}
