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
          <footer className="p-4 fixed bottom-0 w-full bg-background">
            <div className="flex justify-between items-center">
              <Toggle />
              SQLite Viewer V0.3
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
