import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "NewsFlow - Your Personal News Curator",
  description:
    "Search, save, and organize news articles into custom collections",
  generator: "v0.app",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans antialiased">
          <Header />
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
