"use client";

import { DEVICES, type Device } from "@/lib/devices";
import styles from "./device-picker.module.css";

export default function DevicePicker({
  value,
  onChange,
}: {
  value: Device;
  onChange: (d: Device) => void;
}) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Preview on</span>
      <div className={styles.group} role="group" aria-label="Device size">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`${styles.btn} ${value.id === d.id ? styles.on : ""}`}
            onClick={() => onChange(d)}
            aria-pressed={value.id === d.id}
            title={`${d.name}, ${d.w} by ${d.h}`}
          >
            {d.short}
          </button>
        ))}
      </div>
      <span className={styles.size}>
        {value.w} × {value.h}
      </span>
    </div>
  );
}
