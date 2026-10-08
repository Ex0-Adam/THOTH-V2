import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "THOTH Web",
    template: "%s · THOTH Web",
  },
  description: "Public website powered by THOTH headless CMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
