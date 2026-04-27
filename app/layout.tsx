import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import Providers from "@/app/providers";

import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TicketRush",
  description: "Nền tảng đặt vé online hàng đầu cho sự kiện và địa điểm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} antialiased`}>
      <body className="min-h-dvh bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
