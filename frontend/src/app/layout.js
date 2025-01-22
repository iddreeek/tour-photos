import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PhotoAdventure",
  description: "Capture, organize, and showcase your travel memories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4 pb-[72px] pt-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
