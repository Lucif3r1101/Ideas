"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";
import { attribution } from "./attribution";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let analytics: Analytics | null = null;
let starting: Promise<Analytics | null> | null = null;

async function ga(): Promise<Analytics | null> {
  if (analytics) return analytics;
  if (starting) return starting;
  if (!config.apiKey || !config.measurementId) return null;

  starting = (async () => {
    try {
      // false in server rendering, and in browsers that block it
      if (!(await isSupported())) return null;
      const app = getApps().length ? getApp() : initializeApp(config);
      analytics = getAnalytics(app);
      return analytics;
    } catch {
      return null;
    }
  })();

  return starting;
}

/** Fire and forget. Analytics must never break the page. */
export async function track(name: string, params: Record<string, unknown> = {}) {
  const a = await ga();
  if (!a) return;
  try {
    const attr = attribution();
    logEvent(a, name, {
      ...params,
      // both ideas share one GA4 stream, and they share path names like
      // /playground, so without this the events cannot be told apart
      app: process.env.NEXT_PUBLIC_APP_ID,
      source: attr.source,
      channel: attr.channel,
      campaign: attr.utm_campaign || undefined,
    });
  } catch {
    /* ignore */
  }
}

/**
 * Pageview goes to GA4 and to our own store. The second one is what we
 * actually divide signups by, since ad blockers hide a chunk of the first.
 */
export async function trackPageview(path: string) {
  const attr = attribution();

  void track("page_view", { page_path: path });

  try {
    await fetch("/api/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        source: attr.source,
        channel: attr.channel,
        referrer: attr.referrer,
      }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
