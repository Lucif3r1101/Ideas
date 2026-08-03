"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_DEVICE, type Device } from "@/lib/devices";
import styles from "./phone.module.css";

/**
 * A phone at its real pixel size, scaled down to fit whatever space it has.
 *
 * Scaling rather than reflowing matters: the bezel, the corner radius and the
 * screen stay in proportion, so it still reads as a handset on a laptop and on
 * a phone. Reflowing turned it into a slim web card, which is what it looked
 * like before.
 */
export default function Phone({
  children,
  device = DEFAULT_DEVICE,
  time = "9:41",
  maxHeight,
}: {
  children: React.ReactNode;
  device?: Device;
  time?: string;
  /** cap the rendered height, so a tall handset cannot own the whole viewport */
  maxHeight?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const outerW = device.w + device.bezel * 2;
  const outerH = device.h + device.bezel * 2;

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    function fit() {
      const avail = el!.clientWidth;
      if (!avail) return;
      const byWidth = avail / outerW;
      const byHeight = maxHeight ? maxHeight / outerH : Infinity;
      setScale(Math.min(1, byWidth, byHeight));
    }

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [outerW, outerH, maxHeight]);

  return (
    <div
      ref={box}
      className={styles.box}
      style={{ height: outerH * scale }}
      data-device={device.id}
    >
      <div
        className={styles.shell}
        style={{
          width: outerW,
          height: outerH,
          padding: device.bezel,
          borderRadius: device.radius + device.bezel,
          transform: `scale(${scale})`,
        }}
      >
        <span className={styles.btnsL} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.btnR} aria-hidden="true" />

        <div
          className={styles.screen}
          style={{ borderRadius: device.radius }}
        >
          <div className={styles.status}>
            <span className={styles.time}>{time}</span>
            {device.notch === "island" && (
              <span className={styles.island} aria-hidden="true" />
            )}
            <span className={styles.icons} aria-hidden="true">
              <i className={styles.signal} />
              <i className={styles.wifi} />
              <i className={styles.battery} />
            </span>
          </div>

          <div className={styles.content}>{children}</div>

          <div className={styles.homebar} aria-hidden="true">
            {device.notch === "island" ? (
              <span className={styles.homeLine} />
            ) : (
              <span className={styles.homeBtn} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
