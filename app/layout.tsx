import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "Deploy with Spheron on Farcaster",
  description: "Deploy with Spheron on Farcaster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
