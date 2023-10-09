import "./globals.css";
import type { Metadata } from "next";
import { Merriweather_Sans } from "next/font/google";

import ThemeProvider from "@/components/theme/provider";

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
        </ThemeProvider>
      </body>
    </html>
  );
}
