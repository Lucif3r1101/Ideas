import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "../components/WaitlistForm";
import styles from "./how.module.css";

export const metadata: Metadata = {
  title: "How it works: Thumb",
  description:
    "What it generates, where it runs, and what happens when you outgrow the phone. The technical answers, without the hand waving.",
};

const STEPS = [
  {
    n: "01",
    t: "You describe it",
    b: "Plain sentence, thumb typed. No prompt engineering, no template to pick from first.",
  },
  {
    n: "02",
    t: "It writes a real project",
    b: "A TypeScript React project, not a config file feeding a closed runtime. Components, state, the lot.",
  },
  {
    n: "03",
    t: "It runs immediately",
    b: "Compiled and served on a URL straight away. No build step you wait on, no store review.",
  },
  {
    n: "04",
    t: "You change it",
    b: "Ask for a change in words, or open the file and edit it directly. Both work, on the phone.",
  },
];

const QA = [
  {
    q: "What does it actually generate?",
    a: "TypeScript and React, as files you can open. Not a JSON blob feeding a black box renderer, and not a no-code graph you can only edit inside the tool. If you can read React, you can read what came out.",
  },
  {
    q: "Native or web?",
    a: "Web, installable to the home screen as a PWA. That is a deliberate trade. You get a URL you can send to anyone and no app store review, and you give up the deepest native APIs. If your idea needs Bluetooth or a background service, this is the wrong tool and we would rather say so now.",
  },
  {
    q: "Can I edit code, or only chat at it?",
    a: "Both. The editor is built for a small screen, which mostly means big touch targets, a symbol row above the keyboard, and no reliance on a right click. You can go straight to a file and change a line.",
  },
  {
    q: "Do I own it?",
    a: "Yes. Export the project or push it to your own Git repo. It is a normal project on the other side, so it runs anywhere Node runs. Nothing here is designed to make leaving painful.",
  },
  {
    q: "What about a backend and data?",
    a: "A hosted database and typed routes come attached, so a to-do list persists without you standing up infrastructure from a phone. Bring your own if you would rather, it is just fetch calls.",
  },
  {
    q: "Does it work on a slow connection?",
    a: "It has to. This is aimed at people whose only machine is a phone, which usually means mobile data. Editing is local first and syncs when it can, rather than blocking on a round trip per keystroke.",
  },
  {
    q: "What happens when I outgrow the phone?",
    a: "You open the same repo on a laptop and carry on. That is the point of generating a normal project instead of something only we can run. Outgrowing us is a fine outcome.",
  },
];

export default function How() {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <span className={styles.eyebrow}>For the technically minded</span>
        <h1 className={styles.h1}>What it is, without the hand waving.</h1>
        <p className={styles.sub}>
          If you write code already you will want to know what comes out the
          other end, where it runs, and whether you can leave. Here is all of
          that.
        </p>
      </header>

      <section className={styles.steps}>
        <ol className={styles.stepList}>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={styles.stepNum}>{s.n}</span>
              <h2 className={styles.stepT}>{s.t}</h2>
              <p className={styles.stepB}>{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.stack}>
        <h2 className={styles.h2}>What comes out</h2>
        <div className={styles.code}>
          <div className={styles.codeBar}>
            <span className={styles.dot} />
            <code>my-app/</code>
          </div>
          <pre className={styles.pre}>
            <code>{`  app/
    page.tsx          the screen you asked for
    layout.tsx
    api/
      items/route.ts  typed, talks to the db
  components/
    ItemRow.tsx
    AddForm.tsx
  lib/
    db.ts
  package.json        yes, a normal one`}</code>
          </pre>
        </div>
        <p className={styles.stackNote}>
          Clone that on a laptop and <code>npm run dev</code> works. There is no
          proprietary format in the middle.
        </p>
      </section>

      <section className={styles.qa}>
        <h2 className={styles.h2}>The questions we actually get</h2>
        <dl className={styles.qaList}>
          {QA.map((item) => (
            <div key={item.q} className={styles.qaRow}>
              <dt className={styles.q}>{item.q}</dt>
              <dd className={styles.a}>{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.honest}>
        <h2 className={styles.h2}>What it is not for</h2>
        <p className={styles.honestP}>
          Anything needing deep native access, a heavy game engine, or a team of
          six on one codebase. A phone is a constraint and we are not pretending
          otherwise. It is very good for the app you would actually finish,
          which is usually smaller than the one you keep meaning to start.
        </p>
      </section>

      <section className={styles.ask}>
        <h2 className={styles.h2Ask}>Want a look?</h2>
        <p className={styles.askSub}>
          <Link href="/playground" className={styles.inline}>
            Try the playground
          </Link>{" "}
          first if you have not, then leave your email and tell us what
          you&rsquo;d build.
        </p>
        <div className={styles.form}>
          <WaitlistForm id="how" page="mobile-how" />
        </div>
      </section>
    </main>
  );
}
