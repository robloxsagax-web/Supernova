import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supernova - The AI Marketing Agent",
  description: "Turn any product into a complete marketing campaign with AI-powered video ads and creative assets",
  themeColor: '#09090B',
  viewport: {
    themeColor: '#09090B',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://js.puter.com/v2/"></script>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Sidebar />
        <main className="ml-[260px] min-h-screen transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
