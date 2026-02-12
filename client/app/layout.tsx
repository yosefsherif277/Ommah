// src/layout.tsx (Server Component)
import type { Metadata } from "next";
import "./globals.css";
import AuthChecker from "./(pages)/AuthChecker";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Ommah - Social Media App",
  description: "Social Media app",
  icons: {
    icon: "./assets/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={`antialiased`}>
        <Providers>
          <AuthChecker>{children}</AuthChecker>
        </Providers>
      </body>
    </html>
  );
}
