import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "정보처리기사 실기 문제 생성기",
  description: "정보처리기사 실기 핵심 주제 기반 문제 생성 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
