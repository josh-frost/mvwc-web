import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col min-h-screen w-full max-w-3xl items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <Image
          className=""
          src="/main-logo.svg"
          alt="MVWC Logo"
          width={768}
          height={500}
          priority
        />
        <h1 className="w-max text-center text-4xl font-semibold py-5 text-black dark:text-zinc-50">
          Coming Soon
        </h1>
      </main>
    </div>
  );
}
