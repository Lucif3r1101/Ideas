/**
 * Where did this person come from?
 *
 * UTMs only exist on links we tagged ourselves, so most organic traffic
 * arrives with nothing. We fall back to the referrer, and classify it into a
 * channel we can actually group by in a report.
 */

export type Attribution = {
  source: string;
  channel: "paid" | "search" | "social" | "referral" | "direct";
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_page: string;
};

const SEARCH = ["google.", "bing.", "duckduckgo.", "search.yahoo.", "ecosia."];

const SOCIAL: Record<string, string> = {
  "t.co": "x",
  "x.com": "x",
  "twitter.com": "x",
  "lnkd.in": "linkedin",
  "linkedin.com": "linkedin",
  "facebook.com": "facebook",
  "l.facebook.com": "facebook",
  "instagram.com": "instagram",
  "l.instagram.com": "instagram",
  "whatsapp.com": "whatsapp",
  "web.whatsapp.com": "whatsapp",
  "reddit.com": "reddit",
  "out.reddit.com": "reddit",
  "news.ycombinator.com": "hackernews",
  "youtube.com": "youtube",
  "t.me": "telegram",
  "pinterest.com": "pinterest",
  "quora.com": "quora",
};

export const EMPTY: Attribution = {
  source: "direct",
  channel: "direct",
  referrer: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  landing_page: "/",
};

function host(referrer: string) {
  try {
    return new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Resolve once, on the first page someone lands on. */
export function resolve(
  search: string,
  referrer: string,
  path: string,
  selfHost: string
): Attribution {
  const q = new URLSearchParams(search);
  const utm_source = q.get("utm_source") ?? "";
  const utm_medium = q.get("utm_medium") ?? "";

  const base: Attribution = {
    ...EMPTY,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign: q.get("utm_campaign") ?? "",
    utm_content: q.get("utm_content") ?? "",
    utm_term: q.get("utm_term") ?? "",
    landing_page: path || "/",
  };

  // 1. we tagged the link ourselves
  if (utm_source) {
    const paid = ["cpc", "ppc", "paid", "paidsocial", "display"].includes(
      utm_medium.toLowerCase()
    );
    return {
      ...base,
      source: utm_source.toLowerCase(),
      channel: paid ? "paid" : utm_medium ? "referral" : "referral",
    };
  }

  // 2. work it out from the referrer
  const h = host(referrer);
  if (h && h !== selfHost.replace(/^www\./, "")) {
    if (SEARCH.some((s) => h.startsWith(s) || h.includes(s))) {
      return { ...base, source: h.split(".")[0], channel: "search" };
    }
    const social = SOCIAL[h];
    if (social) return { ...base, source: social, channel: "social" };
    return { ...base, source: h, channel: "referral" };
  }

  // 3. nothing to go on. Note that WhatsApp and Instagram often strip the
  //    referrer, so a chunk of real social traffic lands here regardless.
  return base;
}

const KEY = "tinker_attr";

/** Stored once so it survives the walk from the homepage to the playground. */
export function attribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  try {
    const saved = sessionStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as Attribution;
  } catch {
    /* private mode, carry on */
  }

  const found = resolve(
    window.location.search,
    document.referrer,
    window.location.pathname,
    window.location.hostname
  );

  try {
    sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* ignore */
  }

  return found;
}
