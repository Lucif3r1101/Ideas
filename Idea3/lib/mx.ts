import { resolveMx } from "node:dns/promises";

/**
 * Can this domain receive email at all?
 *
 * A domain with no MX records cannot accept mail, so the address is
 * definitely dead and we can say so before sending anyone to /thanks.
 * It does not prove a mailbox exists, only the bounce can do that, but it
 * catches every typo'd or invented domain and costs nothing.
 */

const cache = new Map<string, { ok: boolean; at: number }>();
const TTL = 60 * 60 * 1000; // an hour, MX records rarely move
const TIMEOUT = 2500;

// no point doing a lookup for these
const KNOWN_GOOD = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.in",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "protonmail.com",
  "proton.me",
  "rediffmail.com",
  "zoho.com",
  "zohomail.in",
]);

export async function domainAcceptsMail(domain: string): Promise<boolean> {
  const d = domain.toLowerCase();

  if (KNOWN_GOOD.has(d)) return true;

  const hit = cache.get(d);
  if (hit && Date.now() - hit.at < TTL) return hit.ok;

  try {
    const records = await Promise.race([
      resolveMx(d),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), TIMEOUT)
      ),
    ]);

    // A single "null MX" (MX 0 .) is RFC 7505 for "this domain accepts no
    // mail". It comes back as one record with an empty exchange, so counting
    // the array is not enough. example.com is set up exactly this way.
    const usable = (records ?? []).filter((r) => {
      const host = (r.exchange ?? "").trim().replace(/\.$/, "");
      return host.length > 0;
    });

    const ok = usable.length > 0;
    cache.set(d, { ok, at: Date.now() });
    return ok;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;

    // the domain genuinely does not exist, or has no mail records
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "NXDOMAIN") {
      cache.set(d, { ok: false, at: Date.now() });
      return false;
    }

    // timeout, rate limit, resolver having a bad day. Let them through
    // rather than reject someone with a perfectly good address.
    return true;
  }
}
