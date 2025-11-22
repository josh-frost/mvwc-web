import { MVWCLogo } from "@/components/mvwc-logo";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-16">
      <MVWCLogo className="w-full max-w-2xl h-auto text-primary transition-colors duration-300" />
      <h1 className="text-4xl font-semibold py-8 text-foreground">
        Coming Soon
      </h1>
    </main>
  );
}
