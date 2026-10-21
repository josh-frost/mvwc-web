import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { SanityLive } from "@/sanity/lib/live";
import { DEFAULT_DESCRIPTION, isProductionDeployment, SITE_NAME, SITE_URL } from "@/lib/site";
import { BASE_OPEN_GRAPH, DEFAULT_SHARE_IMAGE } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: { ...BASE_OPEN_GRAPH, images: [DEFAULT_SHARE_IMAGE] },
  twitter: { card: "summary_large_image", images: [DEFAULT_SHARE_IMAGE] },
  robots: isProductionDeployment ? undefined : { index: false, follow: false },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const themeMap = { home: 'theme-home', away: 'theme-away', dark: 'theme-dark' };
                  const theme = localStorage.getItem('mvwc-theme');
                  if (theme && Object.prototype.hasOwnProperty.call(themeMap, theme)) {
                    document.documentElement.classList.add(themeMap[theme]);
                  } else {
                    document.documentElement.classList.add(themeMap.home);
                  }
                } catch (e) {
                  document.documentElement.classList.add('theme-home');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <ThemeProvider defaultTheme="home">
          <Navbar />
          <div className="flex flex-col items-center">{children}</div>
          <Footer />
        </ThemeProvider>
        <SanityLive />
      </body>
    </html>
  );
}
