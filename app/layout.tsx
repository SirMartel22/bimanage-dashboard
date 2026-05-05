import "./globals.css";
import { DM_Sans } from "next/font/google";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Bimanage Dashboard</title>
      </head>
      <body className={`${dmSans.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
