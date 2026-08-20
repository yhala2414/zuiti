import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "话到嘴边",
  description: "年轻人的场景表达转换器",
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
