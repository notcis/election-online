import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sarabun = Sarabun({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "เลือกตั้งออนไลน์ สหกรณ์ออมทรัพย์ พม.",
  description: "ระบบเลือกตั้งออนไลน์สำหรับสหกรณ์ออมทรัพย์ พม.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${(sarabun.className, "white")}`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
