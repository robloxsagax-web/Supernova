import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supernova — The AI Marketing Agent",
  description: "Turn any product into a complete AI-powered marketing campaign",
  themeColor: '#09090B',
  viewport: {
    themeColor: '#09090B',
  },
  icons: {
    icon: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script src="https://js.puter.com/v2/"></script>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
