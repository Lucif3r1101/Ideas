import { saveSignup, readSignups } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max = 2000) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = str(payload.email, 320).toLowerCase();

  if (!EMAIL.test(email)) {
    return Response.json(
      { error: "That doesn't look like an email address." },
      { status: 400 }
    );
  }

  await saveSignup({
    email,
    answer: str(payload.answer),
    page: str(payload.page, 80) || "kids",
    utm_source: str(payload.utm_source, 120),
    utm_medium: str(payload.utm_medium, 120),
    utm_campaign: str(payload.utm_campaign, 120),
    utm_content: str(payload.utm_content, 120),
    referrer: str(payload.referrer, 500),
    createdAt: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}

// Quick way to eyeball results in dev: visit /api/waitlist
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not available." }, { status: 404 });
  }

  const rows = await readSignups();
  const answered = rows.filter((r) => r.answer.length > 0);

  return Response.json({
    total: rows.length,
    answered: answered.length,
    answerRate: rows.length
      ? Math.round((answered.length / rows.length) * 100) + "%"
      : "—",
    rows: rows.slice().reverse(),
  });
}
