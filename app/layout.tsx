import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pannello Admin ULSS 9 Scaligera",
  description: "Pannello di amministrazione per gestire categorie e documenti dell'assistente ULSS 9 Scaligera.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏥</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
