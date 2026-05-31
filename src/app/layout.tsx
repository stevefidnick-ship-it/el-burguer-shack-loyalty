import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Burguer Shack — Combo Rewards",
  description: "Tarjeta de lealtad digital · Digital loyalty punch card — El Burguer Shack, Baja California Sur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0f1a14] flex justify-center">
        <div className="w-full max-w-[430px] min-h-dvh shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
