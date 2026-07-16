import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "your ticket",
  robots: { index: false, follow: false },
};

export default function TicketLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
