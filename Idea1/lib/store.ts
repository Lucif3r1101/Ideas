import { FieldValue } from "firebase-admin/firestore";
import { db, SIGNUPS, HITS } from "./firebase-admin";

export type Signup = {
  email: string;
  answer: string;
  answer_len: number;

  page: string;
  landing_page: string;
  signup_path: string;

  source: string;
  channel: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;

  played: boolean;
  tweaks: number;
  score: number;

  device: string;
  country: string;
};

export type Hit = {
  path: string;
  source: string;
  channel: string;
  referrer: string;
  device: string;
  country: string;
};

/**
 * Email is the document id, so a double submit updates rather than creating a
 * second row.
 *
 * On a repeat submit we deliberately keep the FIRST attribution. If someone
 * arrives from an ad, signs up, then comes back later direct and signs up
 * again, the credit belongs to the ad. Overwriting would quietly turn paid
 * traffic into direct traffic and ruin the comparison between pages.
 *
 * Engagement keeps the high water mark, and an empty answer never wipes one
 * they already gave us.
 */
export async function saveSignup(row: Signup): Promise<{ isNew: boolean }> {
  const ref = db().collection(SIGNUPS()).doc(row.email);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      ...row,
      submits: 1,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
    return { isNew: true };
  }

  const before = snap.data() ?? {};
  const answer = row.answer || (before.answer as string) || "";

  await ref.set(
    {
      // first touch wins
      page: before.page ?? row.page,
      landing_page: before.landing_page ?? row.landing_page,
      signup_path: before.signup_path ?? row.signup_path,
      source: before.source ?? row.source,
      channel: before.channel ?? row.channel,
      referrer: before.referrer ?? row.referrer,
      utm_source: before.utm_source ?? row.utm_source,
      utm_medium: before.utm_medium ?? row.utm_medium,
      utm_campaign: before.utm_campaign ?? row.utm_campaign,
      utm_content: before.utm_content ?? row.utm_content,
      utm_term: before.utm_term ?? row.utm_term,
      created_at: before.created_at,

      // best of both
      answer,
      answer_len: answer.length,
      played: Boolean(before.played) || row.played,
      tweaks: Math.max(Number(before.tweaks) || 0, row.tweaks),
      score: Math.max(Number(before.score) || 0, row.score),

      // latest wins
      email: row.email,
      device: row.device,
      country: row.country || before.country || "",
      submits: (Number(before.submits) || 1) + 1,
      updated_at: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { isNew: false };
}

/**
 * Every pageview, server side. GA4 misses 15 to 30 percent of traffic to ad
 * blockers, and conversion rate is only meaningful if the denominator is real.
 */
export async function saveHit(hit: Hit) {
  await db()
    .collection(HITS())
    .add({ ...hit, created_at: FieldValue.serverTimestamp() });
}

export type Summary = {
  hits: number;
  signups: number;
  answered: number;
  conversion: string;
  answerRate: string;
};

export async function summary(page?: string): Promise<Summary> {
  const store = db();

  const signupQ = page
    ? store.collection(SIGNUPS()).where("page", "==", page)
    : store.collection(SIGNUPS());
  const signupSnap = await signupQ.get();

  const hitSnap = await store.collection(HITS()).count().get();
  const hits = hitSnap.data().count;
  const signups = signupSnap.size;
  const answered = signupSnap.docs.filter(
    (d) => (d.data().answer_len ?? 0) > 0
  ).length;

  const pct = (a: number, b: number) =>
    b ? Math.round((a / b) * 1000) / 10 + "%" : "0%";

  return {
    hits,
    signups,
    answered,
    conversion: pct(signups, hits),
    answerRate: pct(answered, signups),
  };
}
