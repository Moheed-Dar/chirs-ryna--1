"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, MessageCircle } from "lucide-react";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { CONTACT_INFO } from "@/lib/constants";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        // Removed the background color (bg-[#1F2D3D]/80) and shadow classes
        className={`fixed top-0 left-0 w-full z-999 transition-all duration-500 ${
          scrolled ? "backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 lg:px-5 md:py-2 py-3 flex items-center justify-between">
          {/* Logo Image — Larger on md+ */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Desktop Logo (md and up) */}
            <div className="relative w-56 h-20 hidden md:block">
              <Image
                src="/images/navbarlogo1.png"
                alt="Christopher Ryan Properties"
                fill
                className="object-contain brightness-125 contrast-150 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                sizes="288px"
                priority
              />
            </div>
            {/* Mobile Logo (below md) */}
            <div className="relative w-35 h-12 md:hidden">
              <Image
                src="/images/navbarlogo1.png"
                alt="Christopher Ryan Properties"
                fill
                className="object-contain brightness-125 contrast-150 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                sizes="160px"
                priority
              />
            </div>
          </Link>

          {/* Right Side: Phone + Let's Talk + Menu */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Phone Number */}
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="hidden md:flex items-center gap-2 text-[#FFF7F0] hover:text-[#20B2B8] transition-colors"
            >
              <Phone size={16} className="text-[#20B2B8]" />
              <span className="text-sm font-medium tracking-wide">
                {CONTACT_INFO.phone}
              </span>
            </a>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-[#FFF7F0]/20" />

            {/* Let's Talk Button */}
            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#FFF7F0]/10 bg-[#FFF7F0]/10 backdrop-blur-sm text-[#FFF7F0] hover:bg-[#20B2B8]/20 hover:border-[#20B2B8]/40 transition-all duration-300"
            >
              <MessageCircle size={18} className="text-[#20B2B8]" />
              <span className="text-sm font-medium">Let&apos;s Talk</span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-[#FFF7F0]/20" />

            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                isMenuOpen
                  ? "bg-[#20B2B8]/20 border-[#20B2B8]/40"
                  : "bg-[#FFF7F0]/10 border-[#FFF7F0]/10 hover:bg-[#FFF7F0]/20"
              }`}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? (
                <>
                  <X size={18} className="text-[#FFF7F0]" />
                  <span className="hidden sm:inline text-sm font-medium text-[#FFF7F0]">
                    Close
                  </span>
                </>
              ) : (
                <>
                  <Menu size={18} className="text-[#FFF7F0]" />
                  <span className="hidden sm:inline text-sm font-medium text-[#FFF7F0]">
                    Menu
                  </span>
                </>
              )}
            </button>
          </div>
        </nav>
      </header>

      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
