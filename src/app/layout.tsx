import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AJUPY AI",
  description: "AI Textile Design Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-black text-white min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}