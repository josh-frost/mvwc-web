This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Development Data

`.env.local` points at the `production` Sanity dataset. To develop against sample content instead, use the `development` dataset:

```bash
npx sanity login                     # once, or when your session expires
npx sanity dataset create development --visibility public   # once
echo "NEXT_PUBLIC_SANITY_DATASET=development" > .env.development.local
npm run seed
```

`.env.development.local` only applies to `next dev`, so `next build` and Vercel keep using `production`. The local Studio at `/admin` will also edit the `development` dataset.

`npm run seed` loads the sample content in [`sanity/seed/seed.ts`](sanity/seed/seed.ts). It uses fixed document IDs, so re-running it resets the sample documents instead of duplicating them, and it refuses to run against `production`.

## Newsletter Signup

The home page has an email signup with double opt-in. Signing up sends a confirmation email (from `coaches@mountvernonwrestlingclub.com`) with a signed link that expires in 72 hours; the subscriber is added to Resend only after pressing **Confirm subscription** on `/newsletter/confirm`. Newsletters are written and sent from Resend's **Broadcasts**, which handle unsubscribe links.

`coaches@mountvernonwrestlingclub.com` is a Google Workspace group (members: the coaches' own email addresses, posting allowed from anyone on the web), so replies to the confirmation email and newsletters reach the coaches. Resend can send from it because the domain is verified in Resend; receiving relies on the group.

Environment variables (set locally in `.env.local` / `.env.development.local`, and in Vercel for Production and Preview):

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Resend API key with **full access** (managing contacts isn't allowed with sending-only keys) |
| `RESEND_NEWSLETTER_SEGMENT_ID` | ID of the Resend segment confirmed subscribers join: **Newsletter** in Production, **Test** in Preview and locally |
| `NEWSLETTER_CONFIRMATION_SECRET` | Random string, at least 32 characters, used to sign confirmation links. Generate with `openssl rand -base64 32`. Use different values per environment. |

Spam protection: Vercel BotID (Basic) on the signup and confirm actions, a hidden honeypot field, a minimum time before submitting, and server-side validation. The response is identical whether or not an address is already subscribed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
