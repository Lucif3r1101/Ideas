import { saveHit } from "@/lib/store";

function str(v: unknown, max = 400) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Server side pageview. Fires alongside GA4 so the conversion denominator
 * survives ad blockers.
 */
export async function POST(request: Request) {
  try {
    const p = (await request.json()) as Record<string, unknown>;
    const ua = request.headers.get("user-agent") ?? "";

    // cheap bot filter, no point paying to store crawler hits
    if (/bot|crawler|spider|crawling|preview|lighthouse/i.test(ua)) {
      return Response.json({ ok: true, skipped: "bot" });
    }

    await saveHit({
      path: str(p.path, 200) || "/",
      source: str(p.source, 80) || "direct",
      channel: str(p.channel, 30) || "direct",
      referrer: str(p.referrer),
      device: /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop",
      country:
        request.headers.get("x-vercel-ip-country") ??
        request.headers.get("cf-ipcountry") ??
        "",
    });

    return Response.json({ ok: true });
  } catch (err) {
    // never let analytics break a page
    console.error("hit failed", err);
    return Response.json({ ok: false });
  }
}
