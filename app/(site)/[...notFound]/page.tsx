import { notFound } from "next/navigation";

// The app has two root layouts ((site) and (studio)), so there's no single root
// not-found page for unmatched URLs. This catch-all sends any URL no other route
// matches to app/(site)/not-found.tsx, inside the site layout (navbar, footer, theme).
export default function CatchAll() {
  notFound();
}
