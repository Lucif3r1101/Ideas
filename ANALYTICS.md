# Analytics

Both apps report into one Firebase project, `ideas-fa638`, through the same
registered web app and the same GA4 stream. That keeps the setup to one set of
credentials. What it must never do is let two ideas share a number, so the data
is split by idea at every level below.

## APP_ID

Each deployment declares which idea it is:

| Idea | Folder | `APP_ID` |
| ---- | ------ | -------- |
| Coding for kids | `Idea1` | `kids` |
| Mobile first coding | `Idea3` | `mobile` |

It is set twice, as `APP_ID` for the server and `NEXT_PUBLIC_APP_ID` for the
browser, in `.env.local` locally and in each Vercel project's environment.

There is no default. `lib/firebase-admin.ts` throws when `APP_ID` is missing,
which fails a deploy loudly instead of quietly writing two ideas into one pile
and producing numbers nobody can trust weeks later.

## Firestore

Collections are named per idea:

```
signups_kids     hits_kids
signups_mobile   hits_mobile
```

The document id is still the email, unique within one idea's collection. So
someone who signs up to both ideas is two independent signups, each keeping its
own first touch attribution. Before this split they collided on a shared
`signups` collection, and whichever idea they reached first silently won.

Separating `hits` matters just as much. It is the denominator for conversion,
and it exists because ad blockers hide fifteen to thirty percent of GA4. Shared,
it divided one idea's signups by both ideas' traffic: every idea looked worse
than it was, and with uneven traffic the ranking between them was simply wrong.

Comparing ideas is now one query per idea rather than one filtered query. That
is the price of the isolation, and it is worth it.

## Pages within an idea

`page` still labels the individual page, so an idea's own pages stay
comparable:

- Idea1: `kids`, `kids-playground`
- Idea3: `mobile`, `mobile-how`, `mobile-playground`, `mobile-examples`

The default lives in each app's `WaitlistForm`, so a form that forgets the prop
still lands under the right idea. `summary(page)` takes it, and
`/api/waitlist?page=mobile` returns it in development only.

## GA4

Both apps share stream `G-80ZY2RBY3G`, and both serve `/`, `/playground` and
`/thanks`. Every event now carries an `app` parameter from
`NEXT_PUBLIC_APP_ID`, so those colliding paths can be told apart. Register `app`
as a custom dimension in GA4 before it is useful in reports.

Note that Gmail prefetches tracking pixels, so a confirmation email logs an
`opened` event a second after delivery whether or not a human looked at it.
Open rates from this setup are inflated for every recipient.

## Deliverability

Mail sends from `buildlabs.hq@gmail.com` over `brevosend.com` with no domain
authentication, which is the profile mail providers most like to file under
spam or Promotions. Sending from a verified domain is the real fix once traffic
justifies it.
