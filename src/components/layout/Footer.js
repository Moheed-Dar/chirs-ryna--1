"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  Phone,
  Mail,
  Send,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  // ✅ New Color Palette
  const mainTurquoise = "#20B2B8";
  const lightAqua = "#BEEBF0";
  const darkPink = "#D81B60";
  const darkOrange = "#F2673A";
  const peach = "#FFC8B5";
  const darkBg = "#0D1F22";

  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Properties", href: "/properties" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
    { name: "Blogs", href: "/blogs" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: " https://www.facebook.com/Christopher RyanConsultantrealtor/",
      hoverColor: "#1877F2",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: " https://www.instagram.com/Christopher RyanConsultantrealtor/",
      hoverColor: "#E4405F",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@Christopher RyanConsultant",
      hoverColor: "#FF0000",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      href: "https://www.pinterest.com/Christopher Ryan_Consultant/",
      hoverColor: "#E60023",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  const linkClass =
    "group relative text-gray-400 hover:text-[#FFC8B5] transition-colors duration-300 flex items-center gap-2 text-sm py-1 w-fit";

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: darkBg }}
    >
      {/* Decorative Top Border — Turquoise → Peach */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${mainTurquoise}, ${peach}, transparent)`,
        }}
      />

      {/* Subtle Background Glow — Turquoise */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${mainTurquoise}15 0%, transparent 70%)`,
          filter: "blur(120px)",
        }}
      />

      {/* Bottom-right Peach glow */}
      <div
        className="absolute bottom-0 right-0 w-125 h-75 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${peach}08 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid Layout - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 mb-12">
          {/* Column 1: Logo, Description & Social Links */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/images/solidlogo11.png"
                alt="Christopher Ryan Logo"
                width={160}
                height={50}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Helping Ottawa homeowners embrace their next chapter with
              thoughtful guidance, local knowledge, and a real estate experience
              built on trust, kindness, and connection.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.hoverColor;
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = `0 4px 10px ${social.hoverColor}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#9ca3af";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: peach }}
              />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={linkClass}>
                    <ArrowUpRight
                      size={14}
                      className="text-gray-600 group-hover:text-[#FFC8B5] transition-all duration-300 -rotate-45 group-hover:rotate-0 group-hover:scale-110"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    <span className="absolute bottom-0 left-3 w-0 h-px bg-[#FFC8B5] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: peach }}
              />
              Contact Us
            </h3>

            <div className="space-y-4 mb-6">
              <a
                href="#"
                className="group flex items-start gap-3 text-gray-400 hover:text-[#FFC8B5] transition-colors text-sm"
              >
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 transition-all duration-300 shrink-0"
                  style={{
                    backgroundColor: `${mainTurquoise}15`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = mainTurquoise;
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${mainTurquoise}15`;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Building2
                    size={14}
                    className="text-[#20B2B8] group-hover:text-white transition-colors"
                  />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300 mt-1.5">
                  5 Corvus Court, Ottawa, ON, Canada, Ontario
                </span>
              </a>

              <a
                href="tel:+16132914323"
                className="group flex items-center gap-3 text-gray-400 hover:text-[#FFC8B5] transition-colors text-sm"
              >
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 transition-all duration-300 shrink-0"
                  style={{
                    backgroundColor: `${mainTurquoise}15`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = mainTurquoise;
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${mainTurquoise}15`;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Phone
                    size={14}
                    className="text-[#20B2B8] group-hover:text-white transition-colors"
                  />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  +1 613 291 4323
                </span>
              </a>

              <a
                href="mailto:Christopher Ryan@Christopher RyanConsultant.ca"
                className="group flex items-center gap-3 text-gray-400 hover:text-[#FFC8B5] transition-colors text-sm"
              >
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 transition-all duration-300 shrink-0"
                  style={{
                    backgroundColor: `${mainTurquoise}15`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = mainTurquoise;
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${mainTurquoise}15`;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Mail
                    size={14}
                    className="text-[#20B2B8] group-hover:text-white transition-colors"
                  />
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  Christopher Ryan@Christopher RyanConsultant.ca
                </span>
              </a>
            </div>

            {/* Newsletter Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#20B2B8]/80 focus:ring-1 focus:ring-[#20B2B8]/50 transition-all duration-300"
              />
              <button
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainTurquoise}, ${darkOrange})`,
                  boxShadow: `0 4px 12px ${mainTurquoise}40`,
                }}
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col items-center justify-center gap-4"
          style={{ borderTop: `1px solid ${mainTurquoise}15` }}
        >
          {/* Copyright with Tooltip */}
          <div className="group relative cursor-help text-center">
            <p className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
              &copy; {currentYear} Christopher Ryan. All rights reserved.
            </p>

            {/* Custom Tooltip Box */}
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[90vw] max-w-3xl p-5 border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-50"
              style={{
                backgroundColor: darkBg,
                borderColor: `${mainTurquoise}20`,
              }}
            >
              {/* Tooltip Arrow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rotate-45 border-r border-b"
                style={{
                  backgroundColor: darkBg,
                  borderColor: `${mainTurquoise}20`,
                }}
              />

              <div
                className="text-[11px] leading-relaxed text-left space-y-3"
                style={{ color: lightAqua }}
              >
                <p>
                  Copyright {currentYear} All rights reserved. Canadian Real
                  Estate Association assumes no responsibility for the accuracy
                  of any information shown. The information provided herein must
                  only be used by consumers that have a bona fide interest in
                  the purchase, sale or lease of real estate and may not be used
                  for any commercial purpose or any other purpose.
                </p>
                <p>
                  The trademark DDF® is owned by The Canadian Real Estate
                  Association (CREA) and identifies CREA&apos;s Data
                  Distribution Facility (DDF®). The trademarks REALTOR®,
                  REALTORS®, and the REALTOR® logo are controlled by The
                  Canadian Real Estate Association (CREA) and identify real
                  estate professionals who are members of CREA. The trademarks
                  MLS®, Multiple Listing Service®, and the associated logos are
                  owned by CREA and identify the quality of services provided by
                  real estate professionals who are members of CREA.
                </p>
                <p>
                  Copyright {currentYear} All rights reserved. PropTx MLS®
                  assumes no responsibility for the accuracy of any information
                  shown. The information provided herein must only be used by
                  consumers that have a bona fide interest in the purchase, sale
                  or lease of real estate and may not be used for any commercial
                  purpose or any other purpose.
                </p>
              </div>
            </div>
          </div>

          {/* Company Details & Policies */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-gray-500 text-xs text-center">
            <span className="font-medium" style={{ color: lightAqua }}>
              SOLID ROCK REALTY INC.
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span>REALTOR®</span>
          </div>
        </div>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 cursor-pointer right-6 z-50 w-11 h-11 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          background: `linear-gradient(135deg, ${mainTurquoise}, ${darkPink})`,
          boxShadow: `0 4px 16px ${mainTurquoise}40`,
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
