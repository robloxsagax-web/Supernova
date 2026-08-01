import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supernova — AI Marketing Agent",
  description: "Turn any product into a complete AI-powered marketing campaign",
  themeColor: '#09090B',
  viewport: {
    themeColor: '#09090B',
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><defs><radialGradient id='coreG' cx='0.3' cy='0.3' r='0.7'><stop offset='0%25' stop-color='%23FFDAB9'/><stop offset='100%25' stop-color='%235C3317'/></radialGradient><linearGradient id='outerG' x1='0' y1='0' x2='48' y2='48'><stop offset='0%25' stop-color='%23FFDAB9'/><stop offset='100%25' stop-color='%235C3317'/></linearGradient></defs><circle cx='24' cy='24' r='22' stroke='url(%23outerG)' stroke-width='1.5' fill='none' opacity='0.6'/><circle cx='24' cy='24' r='18' stroke='url(%23outerG)' stroke-width='1' fill='none' opacity='0.4'/><circle cx='24' cy='24' r='12' fill='url(%23coreG)'/><circle cx='24' cy='24' r='7' fill='%2309090B'/><circle cx='24' cy='24' r='4' fill='%23FFDAB9'/></svg>",
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
