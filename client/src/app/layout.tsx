// src/app/layout.tsx (Server Component)
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import AuthChecker from "./(pages)/AuthChecker";
import { Toaster } from "react-hot-toast";

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
    <ClerkProvider>
      <html lang="en" className="bg-white">
        <body className={`antialiased`}>
          <AuthChecker>{children}</AuthChecker>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}