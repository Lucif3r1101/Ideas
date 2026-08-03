# Analytics

Both apps report into one Firebase project, `ideas-fa638`, through the same
registered web app and the same GA4 stream. That is deliberate. It keeps the
setup to one set of credentials and lets a single query compare the ideas
against each other, which is the whole point of the test.

The cost of sharing is that the data arrives in one pile. This file records
what is separable today and what is not.

## What tells the apps apart

| Idea | Folder | Signup labels |
| ---- | ------ | ------------- |
| Coding for kids | `Idea1` | `kids`, `kids-playground` |
| Mobile first coding | `Idea3` | `mobile`, `mobile-how`, `mobile-playground`, `mobile-examples` |

Every waitlist form passes one of these as `page`, and it is stored on the
signup. The default lives in each app's `WaitlistForm`, `kids` in Idea1 and
`mobile` in Idea3, so a form that forgets the prop still lands under the right
idea.

To read one idea's numbers, filter `signups` on `page`. `summary(page)` in
`lib/store.ts` already takes it, and `/api/waitlist?page=mobile` returns it in
development.

## What does not

`hits` stores `path` and nothing else. Both apps serve `/`, `/playground` and
`/thanks`, so once the two are live those rows cannot be told apart. GA4 has
the same hole from the other side: `track("page_view")` sends `page_path` with
no idea on it, and both apps report to `G-80ZY2RBY3G`.

This matters more than it first looks. `hits` is the denominator for
conversion, and it exists precisely because ad blockers hide fifteen to thirty
percent of GA4. Merged, it divides one idea's signups by both ideas' traffic.
Both ideas look worse than they are, and if the traffic is uneven the ranking
between them is wrong, which is the one comparison the project is built to
make.

Signups are unaffected. `page` is unambiguous, so the answer rate and the share
of answers naming something specific stay correct per idea.

## Known bug

`Idea3/app/api/waitlist/route.ts` falls back to `|| "kids"` when no page is
sent, copied from Idea1. Harmless today because the client always sends
`mobile`, but an empty page would file an Idea3 signup under Idea1.

## The fix, when it is worth doing

Carry an `app` field, `kids` or `mobile`, alongside `page`, set per app so it
cannot drift:

- `lib/analytics.ts`, include it in the hit payload and every GA4 event
- `app/api/hit/route.ts`, read and store it
- `lib/store.ts`, add it to the `Hit` type
- and fix the fallback above

Existing hit rows would have no `app` field. There is nothing to backfill while
the traffic is still local.
