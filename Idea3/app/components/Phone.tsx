"use client";

import styles from "./phone.module.css";

export default function Phone({
  children,
  time = "9:41",
}: {
  children: React.ReactNode;
  time?: string;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.buttonsL} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className={styles.buttonR} aria-hidden="true" />

      <div className={styles.screen}>
        <div className={styles.status}>
          <span className={styles.time}>{time}</span>
          <span className={styles.notch} aria-hidden="true" />
          <span className={styles.icons} aria-hidden="true">
            <i className={styles.signal} />
            <i className={styles.wifi} />
            <i className={styles.battery} />
          </span>
        </div>

        <div className={styles.content}>{children}</div>

        <div className={styles.homebar} aria-hidden="true" />
      </div>
    </div>
  );
}
