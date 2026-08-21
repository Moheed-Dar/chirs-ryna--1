"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  Send,
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Sparkles,
} from "lucide-react";

// ============================================
// SAME 3-COLOR SCHEME
// ============================================
const TEAL = "#019586";
const GREEN = "#00B777";
const MINT = "#B1F1E9";
const DARK = "#072A26";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = {
    company: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Properties", href: "/properties" },
      { name: "Services", href: "/services" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [{ name: "Blog", href: "/blogs" }],
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/ChristopherRyanConsultantrealtor/",
      hoverColor: TEAL,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/ChristopherRyanConsultantrealtor/",
      hoverColor: GREEN,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@ChristopherRyanConsultant",
      hoverColor: "#FF0000",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      href: "https://www.pinterest.com/ChristopherRyan_Consultant/",
      hoverColor: "#E60023",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: DARK }}
    >
      {/* ===== LAYERED BACKGROUND ===== */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(0deg, 
                ${DARK} 0%, 
                #061e1b 30%, 
                #0a2824 55%, 
                #0e3531 80%,
                #134039 100%
              )
            `,
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-112.5 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${MINT} 0%, ${MINT}B3 25%, ${MINT}66 55%, transparent 100%)`,
          }}
        />

        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-250 h-96 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${MINT}CC 0%, ${MINT}66 45%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />

        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${GREEN}25 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />

        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${MINT}15 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url('/images/logo12.png')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "45% auto",
            mixBlendMode: "screen",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${MINT} 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== SECTION 1: LARGE CTA BANNER (Hidden on Mobile) ===== */}
        <div
          className="relative mt-12 sm:mt-16 mb-16 rounded-3xl overflow-hidden hidden md:block"
          style={{
            background: `linear-gradient(135deg, ${TEAL} 0%, ${DARK} 70%, ${GREEN} 140%)`,
            border: `1px solid ${MINT}20`,
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${MINT} 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${GREEN} 0%, transparent 70%)`,
            }}
          />

          <div className="relative px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-2xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest mb-3"
                style={{
                  backgroundColor: `${MINT}20`,
                  color: MINT,
                  border: `1px solid ${MINT}30`,
                }}
              >
                <Sparkles size={12} />
                Let's Start Your Journey
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-[-0.02em]">
                Ready to find your <br className="hidden sm:block" />
                <span style={{ color: MINT }}>next chapter?</span>
              </h3>
              <p
                className="mt-3 text-sm sm:text-base max-w-md mx-auto lg:mx-0"
                style={{ color: `${MINT}CC` }}
              >
                Whether you're downsizing, upgrading, or investing — I'm here
                to guide you every step of the way.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="https://calendar.app.google/zf9eeGFTRRb44AKU6"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm font-extrabold transition-all duration-300 hover:scale-105 shadow-xl"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: TEAL,
                }}
              >
                Book a Consultation
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm font-extrabold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${MINT}15`,
                  color: MINT,
                  border: `1px solid ${MINT}40`,
                }}
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: MAIN FOOTER GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 pt-12 md:pt-0">
          {/* LEFT: Brand Column - 6/12 cols */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="mb-6">
              <Image
                src="/images/solidlogo11.png"
                alt="Christopher Ryan Logo"
                width={180}
                height={55}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>

            <p
              className="text-sm sm:text-base leading-relaxed mb-6 max-w-md"
              style={{ color: `${MINT}CC` }}
            >
              Helping Northern Virginia homeowners embrace their next chapter with
              thoughtful guidance, local knowledge, and a real estate experience
              built on trust, kindness, and connection.
            </p>

            {/* Contact Mini Cards */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:(202) 848-4567"
                className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:-translate-x-1"
                style={{
                  backgroundColor: `${MINT}08`,
                  border: `1px solid ${MINT}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${TEAL}20`;
                  e.currentTarget.style.borderColor = `${TEAL}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${MINT}08`;
                  e.currentTarget.style.borderColor = `${MINT}15`;
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: `${TEAL}25`,
                    color: MINT,
                  }}
                >
                  <Phone size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: GREEN }}>
                    Call Anytime
                  </p>
                  <p className="text-sm font-semibold text-white truncate">
                    (202) 848-4567
                  </p>
                </div>
              </a>

              <a
                href="mailto:ChristopherRyan@ChristopherRyanConsultant.ca"
                className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:-translate-x-1"
                style={{
                  backgroundColor: `${MINT}08`,
                  border: `1px solid ${MINT}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${TEAL}20`;
                  e.currentTarget.style.borderColor = `${TEAL}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${MINT}08`;
                  e.currentTarget.style.borderColor = `${MINT}15`;
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: `${TEAL}25`,
                    color: MINT,
                  }}
                >
                  <Mail size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: GREEN }}>
                    Email Me
                  </p>
                  <p className="text-sm font-semibold text-white truncate">
                    chris@margenau.com
                  </p>
                </div>
              </a>

              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  backgroundColor: `${MINT}08`,
                  border: `1px solid ${MINT}15`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${TEAL}25`,
                    color: MINT,
                  }}
                >
                  <MapPin size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: GREEN }}>
                    Serving Area
                  </p>
                  <p className="text-sm font-semibold text-white truncate">
                    Business Address: 20830 Gleedsville Rd. Leesburg, VA 20175
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: MINT }}>
                Follow Along
              </p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    style={{
                      backgroundColor: `${MINT}10`,
                      border: `1px solid ${MINT}20`,
                      color: MINT,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = social.hoverColor;
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.boxShadow = `0 6px 16px ${social.hoverColor}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${MINT}10`;
                      e.currentTarget.style.color = MINT;
                      e.currentTarget.style.borderColor = `${MINT}20`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Links Columns - 6/12 cols, 2-column layout */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 sm:gap-6">
            {/* Column 1: Company */}
            <div>
              <h4
                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-extrabold mb-5"
                style={{ color: "#FFFFFF" }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm transition-all duration-300"
                      style={{ color: `${MINT}B0` }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = `${MINT}B0`)}
                    >
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 -rotate-45 group-hover:rotate-0 transition-all duration-300"
                        style={{ color: GREEN }}
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h4
                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-extrabold mb-5"
                style={{ color: "#FFFFFF" }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TEAL }} />
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm transition-all duration-300"
                      style={{ color: `${MINT}B0` }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = `${MINT}B0`)}
                    >
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 -rotate-45 group-hover:rotate-0 transition-all duration-300"
                        style={{ color: GREEN }}
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Quick Contact CTA under Resources for balance */}
              <div
                className="mt-6 p-4 rounded-xl"
                style={{
                  backgroundColor: `${MINT}08`,
                  border: `1px solid ${MINT}15`,
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-wider font-bold mb-1"
                  style={{ color: GREEN }}
                >
                  Quick Question?
                </p>
                <p className="text-sm mb-3" style={{ color: `${MINT}CC` }}>
                  Let's talk about your real estate goals.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold transition-all duration-300 hover:gap-2.5"
                  style={{ color: MINT }}
                >
                  Reach Out
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECTION 3: NEWSLETTER CARD (Hidden on Mobile) ===== */}
        <div
          className="relative rounded-2xl overflow-hidden mb-12 hidden md:block"
          style={{
            backgroundColor: `${MINT}08`,
            border: `1px solid ${MINT}20`,
          }}
        >
          <div
            className="absolute top-0 left-0 w-full h-0.5"
            style={{
              background: `linear-gradient(to right, transparent, ${TEAL}, ${GREEN}, transparent)`,
            }}
          />
          <div
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${TEAL} 0%, transparent 70%)`,
            }}
          />

          <div className="relative px-5 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Send size={16} style={{ color: GREEN }} />
                <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold" style={{ color: GREEN }}>
                  Newsletter
                </p>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold mb-1" style={{ color: "#FFFFFF" }}>
                Stay Updated with Northern Virginia Real Estate
              </h4>
              <p className="text-xs sm:text-sm" style={{ color: `${MINT}B0` }}>
                Get market insights, new listings, and tips delivered monthly.
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-95">
              <div className="relative flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full py-3 pl-5 pr-4 text-sm text-white placeholder-white/40 focus:outline-none transition-all duration-300"
                  style={{
                    backgroundColor: `${MINT}10`,
                    border: `1px solid ${MINT}25`,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = TEAL;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${TEAL}25`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${MINT}25`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  className="shrink-0 px-5 sm:px-6 rounded-full text-sm font-extrabold text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${TEAL}, ${GREEN})`,
                    boxShadow: `0 6px 20px ${TEAL}50`,
                  }}
                  aria-label="Subscribe"
                >
                  Subscribe
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECTION 4: FOOTER LOGO & DISCLAIMER ===== */}
        <div className="pt-8 pb-8 flex flex-col justify-center items-center gap-6 text-center max-w-5xl mx-auto">
          <Image
            src="/images/footlogo1.jpeg"
            alt="Footer Logo"
            width={200}
            height={200}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
            priority={false}
          />
          <p
            className="text-[11px] leading-[1.7] sm:text-xs text-center max-w-4xl"
            style={{ color: `${MINT}90` }}
          >
            © 2026 Bright MLS. All rights reserved. The data relating to real estate for sale on this website appears in part through the Bright MLS Internet Data Exchange (IDX) program, a voluntary cooperative exchange of property listing data between licensed real estate brokerage firms in which Casey Margenau Fine Homes and Estates participates, and is provided by Bright MLS through a licensing agreement.
            <br />
            Listings held by brokerage firms other than Casey Margenau Fine Homes and Estates are marked with the IDX icon and include the listing broker name. Information is provided for the personal, non-commercial use of consumers and may not be used for any purpose other than identifying properties of interest. Property information is deemed reliable but not guaranteed and should be independently verified. Listings may change or be withdrawn without notice and may include errors, omissions, or status updates. Bright MLS compiles listing data from multiple sources and does not guarantee accuracy, including property status or historical information. Some listings may not appear due to seller instruction, brokerage participation, or MLS reporting limitations. Equal Housing Opportunity.
          </p>
        </div>

        {/* ===== SECTION 5: FINAL COPYRIGHT LINE (LAST) ===== */}
        <div
          className="pt-6 pb-4 flex flex-col items-center"
          style={{ borderTop: `1px solid ${MINT}15` }}
        >
          <p
            className="text-xs sm:text-sm transition-colors text-center"
            style={{ color: `${MINT}80` }}
          >
            © 2026 Christopher Ryan. All rights reserved.
          </p>
        </div>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          background: `linear-gradient(135deg, ${TEAL}, ${GREEN})`,
          boxShadow: `0 8px 24px ${TEAL}60`,
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </footer>
  );
}