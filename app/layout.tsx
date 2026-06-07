import type { Metadata } from "next";
import { appMetadataCopy } from "@/config";
import "./globals.css";

export const metadata: Metadata = {
  title: appMetadataCopy.title,
  description: appMetadataCopy.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
