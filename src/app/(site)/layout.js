import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Christopher Ryan Real Estate - Your Trusted Real Estate Partner",
  description: "Premium Real Estate Services",
};

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}