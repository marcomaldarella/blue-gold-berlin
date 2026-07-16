import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "door scanner",
  robots: { index: false, follow: false },
};

export default function ScanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
