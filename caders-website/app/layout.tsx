import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "CADers | KUET",
    template: "%s | CADers",
  },
  description:
    "Official website of CADers, KUET — promoting engineering design and producing quality designers.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "CADers | KUET",
    description:
      "Official website of CADers, KUET — promoting engineering design and producing quality designers.",
    type: "website",
  },
};

const themeInitScript = `
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: {
    username: string;
    full_name: string;
    role: string;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="font-sans antialiased bg-surface text-surface-on"
        suppressHydrationWarning
      >
        <Navbar user={profile} />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}