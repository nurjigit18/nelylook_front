import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300","400","500","600","700","800"], // pick what you need
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Nely Look - Modern Fashion",
  description: "Discover elegant fashion for every occasion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
