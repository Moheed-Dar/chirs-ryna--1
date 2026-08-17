"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  ShieldCheck,
  X,
  Home,
  Building2,
  BookOpen,
  Phone,
  Star,
  FileText,
  User,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Testimonials", href: "/testimonials", icon: Building2 },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
];

const CMS_LINKS = [
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Services", href: "/services", icon: Star },
  { label: "Contact Us", href: "/contact", icon: Phone },
];

export default function FullscreenMenu({ isOpen, onClose }) {
  const circleRef = useRef(null);
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    setMounted(true);

    const checkAuthStatus = () => {
      try {
        const cookies = document.cookie.split(";");
        const authCookieNames = [
          "token",
          "auth_token",
          "session",
          "auth-session",
          "next-auth.session-token",
          "sb-access-token",
          "supabase-auth-token",
        ];

        const hasAuthCookie = cookies.some((cookie) => {
          const trimmedCookie = cookie.trim();
          return authCookieNames.some((name) =>
            trimmedCookie.startsWith(`${name}=`)
          );
        });

        if (hasAuthCookie) {
          setIsLoggedIn(true);
          return;
        }

        const localStorageKeys = [
          "token",
          "auth_token",
          "access_token",
          "user",
          "auth",
        ];

        const hasLocalToken = localStorageKeys.some((key) => {
          const value = localStorage.getItem(key);
          if (!value) return false;
          try {
            const parsed = JSON.parse(value);
            return parsed?.token || parsed?.access_token || parsed?.session;
          } catch {
            return value && value.length > 10;
          }
        });

        if (hasLocalToken) {
          setIsLoggedIn(true);
          return;
        }

        const sessionKeys = ["token", "auth_token", "access_token"];
        const hasSessionToken = sessionKeys.some((key) => {
          const value = sessionStorage.getItem(key);
          return value && value.length > 10;
        });

        if (hasSessionToken) {
          setIsLoggedIn(true);
          return;
        }

        setIsLoggedIn(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();

    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  // Admin link dynamic config
  const adminLinkConfig = {
    href: isLoggedIn ? "/admin/dashboard" : "/admin/login",
    label: isLoggedIn ? "Dashboard" : "Admin",
    icon: isLoggedIn ? LayoutDashboard : ShieldCheck,
  };

  // Proper close handler
  const handleClose = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    onClose();
  };

  // Link click handler
  const handleLinkClick = (e) => {
    e.stopPropagation();
    handleClose();
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // GSAP Pulse Animation
  useEffect(() => {
    if (!isOpen || !circleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        scale: 1.3,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      gsap.to(circleRef.current, {
        opacity: 0.6,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });
    return () => ctx.revert();
  }, [isOpen]);

  // GSAP slide-in for desktop
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* ===== DESKTOP BACKDROP — sirf md+ ===== */}
      <div
        className="hidden md:block fixed inset-0 z-998 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* ========== DESKTOP MENU (md and above) ========== */}
      <div
        ref={menuRef}
        className="hidden md:flex fixed top-25 left-0 right-0 z-999 justify-center px-4 lg:px-8"
      >
        <div className="w-full max-w-3xl bg-[#FFF7F0] rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Hero Preview Image */}
            <div className="relative h-44 lg:h-auto lg:min-h-70">
              <Image
                src="/banner/banner2.jpg"
                alt="Christopher Ryan Properties Preview"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 128px, 160px"
              />
              {/* Navy overlay instead of black */}
              <div className="absolute inset-0 bg-linear-to-t from-[#1F203D]/80 via-[#1F203D]/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <div className="relative w-24 h-8 flex items-center justify-center">
                  <div className="relative z-10 mt-10 w-50 h-20">
                    <Image
                      src="/images/solidlogo11.png"
                      alt="Christopher Ryan"
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 left-3">
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  Christopher Ryan
                </h2>
              </div>
            </div>

            {/* Right: Navigation Links */}
            <div className="p-5 lg:p-6 bg-[#FFF7F0]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex flex-col gap-1.5">
                    {DEFAULT_NAV_LINKS.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        onClick={handleLinkClick}
                        className="group relative py-1.5 text-gray-600 hover:text-[#208288] transition-colors text-sm font-medium"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#208288] transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-col gap-1.5">
                    {CMS_LINKS.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        onClick={handleLinkClick}
                        className="group relative py-1.5 text-gray-600 hover:text-[#208288] transition-colors text-sm font-medium"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#208288] transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#BEEBF0] p-4 flex items-center justify-between gap-3 bg-[#FFF7F0]">
            <a
              href="mailto:chris@margenau.com"
              className="flex items-center gap-2 text-gray-500 hover:text-[#208288] transition-colors"
            >
              <Mail size={15} />
              <span className="text-sm font-medium">
                chris@margenau.com
              </span>
            </a>

            <div className="flex items-center gap-2">
              {/* Dynamic Admin/Dashboard Link */}
              <Link
                href={adminLinkConfig.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isLoggedIn
                    ? "bg-[#F2673A]/10 border border-[#F2673A]/30 text-[#F2673A] hover:bg-[#F2673A]/20 hover:border-[#F2673A]/50"
                    : "bg-[#BEEBF0]/50 border border-[#208288]/30 text-[#208288] hover:bg-[#BEEBF0] hover:border-[#208288]/50"
                }`}
              >
                {(() => {
                  const AdminIcon = adminLinkConfig.icon;
                  return <AdminIcon size={16} />;
                })()}
                <span>{adminLinkConfig.label}</span>
              </Link>
              <Link
                href="/properties"
                onClick={handleLinkClick}
                className="px-4 py-2 bg-[#1F203D] text-white text-sm font-semibold rounded-lg hover:bg-[#208288] transition-colors"
              >
                All Properties
              </Link>
              <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center bg-[#1F203D] text-white rounded-lg hover:bg-[#208288] transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== MOBILE SIDEBAR (below md) ========== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-998 bg-black/50 backdrop-blur-[2px]"
              onClick={handleClose}
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="md:hidden fixed top-0 right-0 bottom-0 z-999 w-80 bg-[#FFF7F0] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                onClick={handleClose}
                className="absolute top-3 right-3 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-[#208288] text-white hover:bg-[#1F203D] transition-colors shadow-lg"
              >
                <X size={18} />
              </motion.button>

              {/* Hero Image */}
              <div className="relative h-40 shrink-0">
                <Image
                  src="/banner/banner2.jpg"
                  alt="Christopher Ryan"
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority
                />
                {/* Navy overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#1F203D]/80 via-[#1F203D]/30 to-transparent" />

                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/30">
                    <div className="w-6 h-6 rounded-full bg-[#208288] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">S</span>
                    </div>
                    <span className="text-white font-semibold text-xs">
                      Christopher Ryan
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3">
                  <p className="text-white/70 text-[10px] tracking-widest uppercase">
                    Premium Real Estate
                  </p>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Find Your Dream Home
                  </h2>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 px-4 py-4 overflow-y-auto">
                {/* Main Pages */}
                <div className="mb-3">
                  <h3 className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    Main Pages
                  </h3>
                  <div className="flex flex-col gap-1">
                    {DEFAULT_NAV_LINKS.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={index}
                          href={link.href}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#BEEBF0] active:bg-[#BEEBF0]/70 transition-all duration-200"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#BEEBF0]/50 group-hover:bg-[#208288] flex items-center justify-center transition-all duration-200">
                            <Icon
                              size={16}
                              className="text-[#208288] group-hover:text-white transition-colors duration-200"
                            />
                          </div>
                          <span className="text-gray-700 group-hover:text-[#208288] font-medium text-sm transition-colors duration-200">
                            {link.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-[#BEEBF0] my-3" />

                {/* CMS Pages */}
                <div>
                  <h3 className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    Explore
                  </h3>
                  <div className="flex flex-col gap-1">
                    {CMS_LINKS.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={index}
                          href={link.href}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#BEEBF0] active:bg-[#BEEBF0]/70 transition-all duration-200"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#BEEBF0]/50 group-hover:bg-[#208288] flex items-center justify-center transition-all duration-200">
                            <Icon
                              size={16}
                              className="text-[#208288] group-hover:text-white transition-colors duration-200"
                            />
                          </div>
                          <span className="text-gray-700 group-hover:text-[#208288] font-medium text-sm transition-colors duration-200">
                            {link.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-[#BEEBF0] px-4 py-4 shrink-0 bg-[#BEEBF0]/30">
                {/* Email */}
                <a
                  href="mailto:Christopher Ryan@Christopher RyanConsultant.ca"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-[#208288] transition-colors mb-3"
                >
                  <Mail size={12} />
                  <span className="text-[11px] font-medium">
                    chris@margenau.com
                  </span>
                </a>

                <div className="flex flex-col items-center gap-2">
                  {/* Dynamic Admin/Dashboard Link */}
                  <Link
                    href={adminLinkConfig.href}
                    onClick={handleLinkClick}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isLoggedIn
                        ? "bg-[#F2673A]/10 border border-[#F2673A]/30 text-[#F2673A] hover:bg-[#F2673A]/20 active:bg-[#F2673A]/30"
                        : "bg-[#BEEBF0]/50 border border-[#208288]/30 text-[#208288] hover:bg-[#BEEBF0] active:bg-[#BEEBF0]/70"
                    }`}
                  >
                    {(() => {
                      const AdminIcon = adminLinkConfig.icon;
                      return <AdminIcon size={16} />;
                    })()}
                    <span>
                      {isLoggedIn ? "Go to Dashboard" : "Admin Login"}
                    </span>
                  </Link>

                  <Link
                    href="/properties"
                    onClick={handleLinkClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#208288] text-white text-sm font-semibold rounded-xl hover:bg-[#1F203D] active:bg-[#1F203D] transition-all duration-200"
                  >
                    <FileText size={16} />
                    <span>All Properties</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}