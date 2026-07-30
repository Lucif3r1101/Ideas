"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./waitlist-form.module.css";

const PAGE = "kids";

type Tracking = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  referrer: string;
};

const EMPTY: Tracking = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  referrer: "",
};

export default function WaitlistForm({ id }: { id: string }) {
  const router = useRouter();
  const tracking = useRef<Tracking>(EMPTY);
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");

  // UTMs come off the URL so the visitor never sees extra fields.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    tracking.current = {
      utm_source: q.get("utm_source") ?? "",
      utm_medium: q.get("utm_medium") ?? "",
      utm_campaign: q.get("utm_campaign") ?? "",
      utm_content: q.get("utm_content") ?? "",
      referrer: document.referrer ?? "",
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    if (!email.trim()) {
      setError("Pop your email in first.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          answer: answer.trim(),
          page: PAGE,
          ...tracking.current,
        }),
      });

      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setError(b.error ?? "That didn't work. Try again?");
        setStatus("idle");
        return;
      }

      router.push("/thanks");
    } catch {
      setError("Couldn't reach us. Check your connection.");
      setStatus("idle");
    }
  }

  const started = email.trim().length > 2;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <input
          className={styles.input}
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your email"
          aria-label="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className={styles.button}
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "one sec…" : "Get early access"}
        </button>
      </div>

      {started && (
        <textarea
          className={styles.textarea}
          id={`${id}-answer`}
          name="answer"
          rows={2}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="what would your kid make? (optional, but we read every one)"
          aria-label="What would your kid make?"
        />
      )}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        <p className={styles.fine}>One email when it&rsquo;s ready. Nothing else.</p>
      )}
    </form>
  );
}
