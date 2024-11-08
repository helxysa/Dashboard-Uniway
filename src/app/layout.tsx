import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideBar from "./SideBar/SideBar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <SideBar />
        {children}
      </body>
    </html>
  );
}
