import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SanityLive } from "@/sanity/lib/live";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mount Vernon Wrestling Club",
  description: "Everything MVWC",
};

export default function RootLayout({
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultTheme="home">
          <Navbar />
          <div className="flex flex-col items-center">{children}</div>
        </ThemeProvider>
        <SanityLive />
      </body>
    </html>
  );
}
