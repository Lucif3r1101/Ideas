# Ideas

Landing pages for testing four product ideas, each with its own waitlist.
One shared template, one copy variant per idea, so the signup numbers stay
comparable across them.

## Ideas

| Folder | Idea | Status |
| ------ | ---- | ------ |
| `Idea1` | Coding for kids. Describe a game, it gets built, then you change it. | built |
| `Idea2` | Making an existing product AI native | not started |
| `Idea3` | Mobile first coding. Build real apps on a phone, no laptop. | built |
| `Idea4` | Building AI products | not started |

## How the test works

Every page asks the same two things: an email, and one optional open question,
"what are you hoping to build". The question is identical everywhere on
purpose. Change the question per page and a page can win just because its
question was easier to answer.

UTM parameters are read off the URL and stored with each signup, so we can tell
a good idea from a good traffic source.

The number that decides anything is not total signups. It is the share of
answers that name something specific. "A bot that drafts replies to our support
tickets" is real intent. "An AI agent" is someone echoing the page.

## Running one locally

```bash
cd Idea1
npm install
npm run dev
```

Then open http://localhost:3000

Signups append to `Idea1/data/waitlist.jsonl`, which is gitignored. Visit
`/api/waitlist` in development for a running total, the number answered, and the
answer rate.

## Before deploying

Signups currently write to a local file. That works on a laptop and silently
loses data on Vercel, where the filesystem is wiped between invocations. Swap
`lib/store.ts` for a real database first. Everything else stays as it is.

## Stack

Next.js App Router, TypeScript, CSS modules, no UI framework.
