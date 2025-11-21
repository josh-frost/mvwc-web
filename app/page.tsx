import { MVWCLogo } from "@/components/mvwc-logo";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] bg-background font-sans">
      <main className="flex flex-col w-full max-w-3xl items-center justify-center py-16 px-8 md:px-16">
        <MVWCLogo className="w-full max-w-2xl h-auto text-primary transition-colors duration-300" />
        <h1 className="w-max text-center text-4xl font-semibold py-5 text-foreground">
          Coming Soon
        </h1>
      </main>
    </div>
  );
}
