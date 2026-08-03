import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Admin SDK, server only. Credentials come from env so the same code runs
 * locally and on a host, and so the key file never has to be deployed.
 */
function app() {
  if (getApps().length) return getApp();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase admin env vars missing. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function db() {
  return getFirestore(app());
}

/**
 * Every idea gets its own collections, so the same person signing up to two
 * ideas is two independent signups rather than one document quietly winning
 * on first touch. It also keeps `hits` separate, which matters because hits
 * is the denominator for conversion.
 *
 * Deliberately no default. A missing APP_ID would silently merge two ideas
 * into one pile, which is the exact bug this is here to prevent, and it would
 * only show up weeks later as numbers that cannot be trusted.
 */
function appId() {
  const id = process.env.APP_ID;
  if (!id) {
    throw new Error(
      "APP_ID is missing. Set it to the idea this deployment serves, e.g. APP_ID=mobile."
    );
  }
  return id;
}

export const SIGNUPS = () => `signups_${appId()}`;
export const HITS = () => `hits_${appId()}`;
