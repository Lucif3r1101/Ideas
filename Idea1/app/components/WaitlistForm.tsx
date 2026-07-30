"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { attribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import styles from "./waitlist-form.module.css";

export default function WaitlistForm({
  id,
  page = "kids",
  played = false,
  tweaks = 0,
  score = 0,
}: {
  id: string;
  page?: string;
  /** engagement, so we can see whether playing predicts signing up */
  played?: boolean;
  tweaks?: number;
  score?: number;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    if (!email.trim()) {
      setError("Pop your email in first.");
      return;
    }

    setStatus("sending");
    setError("");

    const attr = attribution();

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          answer: answer.trim(),
          page,
          played,
          tweaks,
          score,
          signup_path:
            typeof window === "undefined" ? "/" : window.location.pathname,
          ...attr,
        }),
      });

      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        void track("waitlist_error", { page, reason: b.error ?? "unknown" });
        setError(b.error ?? "That didn't work. Try again?");
        setStatus("idle");
        return;
      }

      const body = await res.json().catch(() => ({}));
      void track("waitlist_submit", {
        page,
        has_answer: answer.trim().length > 0,
        answer_len: answer.trim().length,
        played,
        tweaks,
        score,
        is_new: body.isNew !== false,
      });

      router.push("/thanks");
    } catch {
      void track("waitlist_error", { page, reason: "network" });
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
