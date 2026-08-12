import { Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Christopher Ryan Real Estate - Your Trusted Real Estate Partner",
  description: "Christopher Ryan Real Estate - Find your dream home",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${montserrat.variable} antialiased`}
    >
      <body
        className="min-h-screen bg-[#0a1628] text-white font-sans antialiased"
        suppressHydrationWarning
      >
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}