import { saveSignup, summary } from "@/lib/store";
import { checkEmail } from "@/lib/email";
import { domainAcceptsMail } from "@/lib/mx";
import { sendConfirmation } from "@/lib/mailer";

function str(v: unknown, max = 2000) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function num(v: unknown, max = 100000) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.min(Math.max(0, Math.round(n)), max) : 0;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const check = checkEmail(payload.email);
  if (!check.ok) {
    return Response.json(
      { error: check.error, suggestion: check.suggestion },
      { status: 400 }
    );
  }
  const email = check.email;

  // can that domain receive mail at all? blocks /thanks on a dead domain
  const domain = email.split("@")[1];
  if (!(await domainAcceptsMail(domain))) {
    return Response.json(
      { error: `${domain} can't receive email. Check the spelling?` },
      { status: 400 }
    );
  }

  const answer = str(payload.answer);
  const ua = request.headers.get("user-agent") ?? "";

  try {
    const { isNew } = await saveSignup({
      email,
      answer,
      answer_len: answer.length,

      page: str(payload.page, 60) || "kids",
      landing_page: str(payload.landing_page, 200) || "/",
      signup_path: str(payload.signup_path, 200) || "/",

      source: str(payload.source, 80) || "direct",
      channel: str(payload.channel, 30) || "direct",
      referrer: str(payload.referrer, 400),
      utm_source: str(payload.utm_source, 120),
      utm_medium: str(payload.utm_medium, 120),
      utm_campaign: str(payload.utm_campaign, 120),
      utm_content: str(payload.utm_content, 120),
      utm_term: str(payload.utm_term, 120),

      played: Boolean(payload.played),
      tweaks: num(payload.tweaks, 999),
      score: num(payload.score, 9999),

      device: /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop",
      country:
        request.headers.get("x-vercel-ip-country") ??
        request.headers.get("cf-ipcountry") ??
        "",
    });

    // fire and forget, a failed email is not a reason to lose the signup
    if (isNew) {
      void sendConfirmation(email, answer);
    }

    return Response.json({ ok: true, isNew });
  } catch (err) {
    console.error("waitlist save failed", err);
    return Response.json(
      { error: "Couldn't save that. Try again in a moment?" },
      { status: 500 }
    );
  }
}

// Quick numbers while testing. Not exposed in production.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not available." }, { status: 404 });
  }

  const page = new URL(request.url).searchParams.get("page") ?? undefined;

  try {
    return Response.json(await summary(page));
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
