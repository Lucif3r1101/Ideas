/**
 * Brevo transactional send. Plain REST, no SDK needed.
 *
 * Never throws at the caller. If the key is missing or Brevo is down we log
 * it and carry on, because a failed confirmation email is not a reason to
 * lose a signup we already stored.
 */

const ENDPOINT = "https://api.brevo.com/v3/smtp/email";

type Result = { sent: boolean; reason?: string };

export function mailerReady() {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
}

export async function sendConfirmation(
  to: string,
  answer: string
): Promise<Result> {
  const key = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Tinker";

  if (!key || !senderEmail) return { sent: false, reason: "not configured" };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: "You're on the Tinker list",
        htmlContent: html(answer),
        textContent: text(answer),
        tags: ["waitlist"],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("brevo send failed", res.status, body.slice(0, 300));
      return { sent: false, reason: `brevo ${res.status}` };
    }

    return { sent: true };
  } catch (err) {
    console.error("brevo send threw", err);
    return { sent: false, reason: "network" };
  }
}

function text(answer: string) {
  return [
    "You're on the list.",
    "",
    "Thanks for signing up to Tinker. We'll email you once, when access opens. Nothing in between.",
    answer ? `You told us you'd build: "${answer}". We read every one of these.` : "",
    "",
    "If you didn't sign up, just ignore this and we'll leave you alone.",
  ]
    .filter(Boolean)
    .join("\n");
}

function html(answer: string) {
  const said = answer
    ? `<tr><td style="padding:0 0 18px">
         <div style="background:#F3F1FC;border-left:3px solid #6C4CE0;border-radius:0 8px 8px 0;padding:12px 15px">
           <div style="font:600 11px/1 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#7A78A0;margin-bottom:6px">You said</div>
           <div style="font:600 15px/1.5 system-ui,sans-serif;color:#24223D">${escapeHtml(answer)}</div>
         </div>
       </td></tr>
       <tr><td style="padding:0 0 18px;font:400 15px/1.6 system-ui,sans-serif;color:#6B6890">
         We read every one of these. They genuinely decide what gets built next.
       </td></tr>`
    : "";

  return `<!doctype html>
<html><body style="margin:0;background:#EAF3FF;padding:28px 16px">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden">
    <tr><td style="background:#6C4CE0;padding:26px 28px">
      <div style="font:700 24px/1 system-ui,sans-serif;letter-spacing:-.02em;color:#fff">Tinker</div>
    </td></tr>
    <tr><td style="padding:28px 28px 8px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding:0 0 12px;font:700 26px/1.15 system-ui,sans-serif;letter-spacing:-.02em;color:#24223D">
          You're on the list.
        </td></tr>
        <tr><td style="padding:0 0 20px;font:400 16px/1.6 system-ui,sans-serif;color:#6B6890">
          We'll email you once, when access opens. Nothing in between, and no newsletter.
        </td></tr>
        ${said}
      </table>
    </td></tr>
    <tr><td style="padding:6px 28px 26px;border-top:1px solid #EDEBF6">
      <div style="font:400 13px/1.5 system-ui,sans-serif;color:#9D9ABB;padding-top:16px">
        Didn't sign up? Ignore this and we'll leave you alone.
      </div>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string
  );
}
