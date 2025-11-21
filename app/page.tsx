import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-3xl items-center justify-center py-16 px-8 md:px-16 dark:bg-black">
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
