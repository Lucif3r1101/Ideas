import { promises as fs } from "fs";
import path from "path";

export type Signup = {
  email: string;
  answer: string;
  page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  referrer: string;
  createdAt: string;
};

const FILE = path.join(process.cwd(), "data", "waitlist.jsonl");

/**
 * Local-file store so this works on localhost with zero setup.
 * Swap the body of this function for a Google Sheets / Supabase write
 * when we go live. Nothing else needs to change.
 */
export async function saveSignup(row: Signup) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.appendFile(FILE, JSON.stringify(row) + "\n", "utf8");
}

export async function readSignups(): Promise<Signup[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Signup);
  } catch {
    return [];
  }
}
