import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const metadata: Metadata = {
  title: "Supernova - AI Marketing Agent",
  description: "Turn any product into a complete AI-powered marketing campaign",
  themeColor: '#09090B',
  viewport: {
    themeColor: '#09090B',
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%235C3317'/><stop offset='100%25' stop-color='%23FFDAB9'/></linearGradient></defs><circle cx='50' cy='50' r='45' fill='url(%23g)'/></svg>",
        type: "image/svg+xml",
      },
    ],
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
      <body className="font-sans antialiased">
        <AuroraBackground />
        <Sidebar />
        <main className="ml-[280px] min-h-screen transition-all duration-300 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
