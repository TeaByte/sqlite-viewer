import "./globals.css";
import type { Metadata } from "next";
import { Merriweather_Sans } from "next/font/google";

import ThemeProvider from "@/components/theme/provider";
import Toggle from "@/components/theme/toggle";

const font = Merriweather_Sans({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "SQLite Viewer",
  description: "SQLite Viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <footer className="p-4 fixed bottom-0 w-full bg-background border-t border-secondary">
            <div className="flex justify-between items-center">
              <Toggle />
              <span className="hover:animate-bounce animate-pulse">
                SQLite Viewer V0.4
              </span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
