import { MVWCLogo } from "@/components/mvwc-logo";
import { sanityFetch } from "@/sanity/lib/live";

const HOME_QUERY = `*[_type == "homePage" && _id == "homePage"][0]{
  title,
  subtitle,
  showComingSoon
}`;

export default async function Home() {
  const { data: homePage } = await sanityFetch({ query: HOME_QUERY });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] bg-background font-sans">
      <main className="flex flex-col w-full max-w-3xl items-center justify-center py-16 px-4 sm:px-8 md:px-16">
        <MVWCLogo className="w-full max-w-2xl h-auto text-primary transition-colors duration-300" />
        <h1 className="w-max text-center text-4xl font-semibold py-5 text-foreground">
          {homePage?.showComingSoon !== false ? "Coming Soon" : homePage?.title}
        </h1>
        {homePage?.subtitle && !homePage?.showComingSoon && (
          <p className="text-center text-xl text-muted-foreground">{homePage.subtitle}</p>
        )}
      </main>
    </div>
  );
}
