import { sanityClient } from "@/sanity/lib/client";

export default function AboutPage() {
  const aboutContent = async () => {
    const query = `*[_type == "content"][0]{
      title,
      description,
    }`;
    return await sanityClient.fetch(query);
  };

  return (
    <main className="flex flex-col px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Mount Vernon Wrestling Club</h1>
    </main>
  );
}
