import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideBar from "./SideBar/SideBar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard do Uniway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased bg-white`}
      >
        <SideBar />
        {children}
      </body>
    </html>
  );
}
