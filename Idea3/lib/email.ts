/**
 * We cannot prove an address exists without sending to it, and a confirmation
 * email is more friction than a waitlist is worth. What we can do is reject
 * the things that are definitely not a real person, and catch typos before
 * they cost us a signup.
 */

const SHAPE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Throwaway inbox providers. Someone using one is not a real lead. */
const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "sharklasers.com",
  "maildrop.cc",
  "dispostable.com",
  "fakeinbox.com",
  "mailnesia.com",
  "spamgourmet.com",
  "mohmal.com",
  "emailondeck.com",
  "tempr.email",
]);

/** Obvious placeholders people type to skip a form. */
const FAKE = new Set([
  "test@test.com",
  "a@a.com",
  "test@example.com",
  "asd@asd.com",
  "abc@abc.com",
  "email@email.com",
  "user@example.com",
  "admin@admin.com",
  "qwe@qwe.com",
  "aa@aa.com",
  "1@1.com",
]);

/** Near misses for the big providers, so we can offer a fix. */
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmail.cm": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "iclod.com": "icloud.com",
  "icloud.co": "icloud.com",
  "rediffmial.com": "rediffmail.com",
};

export type Check =
  | { ok: true; email: string }
  | { ok: false; error: string; suggestion?: string };

export function checkEmail(raw: unknown): Check {
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";

  if (!email) return { ok: false, error: "Pop your email in first." };
  if (email.length > 254) return { ok: false, error: "That address is too long." };

  if (!SHAPE.test(email)) {
    return { ok: false, error: "That doesn't look like an email address." };
  }

  // one @, and the parts either side have to be sane
  const parts = email.split("@");
  if (parts.length !== 2) {
    return { ok: false, error: "That doesn't look like an email address." };
  }

  const [local, domain] = parts;
  if (!local || local.length > 64) {
    return { ok: false, error: "That doesn't look like an email address." };
  }
  if (domain.includes("..") || domain.startsWith("-") || domain.endsWith("-")) {
    return { ok: false, error: "Check the bit after the @, something is off." };
  }

  const suggestion = TYPOS[domain];
  if (suggestion) {
    return {
      ok: false,
      error: `Did you mean ${local}@${suggestion}?`,
      suggestion: `${local}@${suggestion}`,
    };
  }

  if (DISPOSABLE.has(domain)) {
    return {
      ok: false,
      error: "That's a temporary inbox. Use one you actually check.",
    };
  }

  if (FAKE.has(email)) {
    return { ok: false, error: "Go on, a real one. We only email once." };
  }

  return { ok: true, email };
}
