"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// ============================================
// SAME 3-COLOR SCHEME AS HERO SECTION
// ============================================
const TEAL = "#019586";
const GREEN = "#00B777";
const MINT = "#B1F1E9";
const DARK = "#072A26";

// ============================================
// SOCIAL ICONS - Only LinkedIn
// ============================================
const LinkedInIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const imagesRef = useRef(null);
  const bioRef = useRef(null);

  const images = [
    { src: "/images/about5up.jpg", alt: "Northern Virginia Real Estate 1" },
    { src: "/images/about1up.jpg", alt: "Northern Virginia Real Estate 2" },
    { src: "/images/about3up.jpg", alt: "Northern Virginia Real Estate 3" },
    { src: "/images/about2up.jpg", alt: "Northern Virginia Real Estate 4" },
  ];

  // Only LinkedIn social link
  const socialLinks = [
    {
      icon: LinkedInIcon,
      href: "https://www.linkedin.com/in/christopher-lepkowski/",
      label: "LinkedIn",
      hoverColor: TEAL,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(bioRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const frameVariants = [
    { rotate: -3, y: 20 },
    { rotate: 2, y: -10 },
    { rotate: -2, y: 15 },
    { rotate: 3, y: -5 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-16 sm:py-24 md:py-28 lg:py-32"
    >
      {/* ===== BACKGROUND: BOTTOM TO TOP GRADIENT ===== */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${TEAL} 0%, ${GREEN} 25%, ${MINT} 60%, ${MINT} 100%)`,
          }}
        />

        {/* ===== WATERMARK: navbarlogo11.png (PROPERLY VISIBLE) ===== */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url('/images/navbarlogo1.png')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "50% auto",
            opacity: 0.15,
            mixBlendMode: "multiply",
          }}
        />

        {/* Mobile pe watermark chhota */}
        <div
          className="absolute inset-0 pointer-events-none sm:hidden"
          style={{
            backgroundImage: `url('/images/navbarlogo1.png')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "75% auto",
            opacity: 0.12,
            mixBlendMode: "multiply",
          }}
        />

        {/* Extra gradient overlay for depth */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${DARK} 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* "Who I Am" Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <span
            className="inline-block rounded-full px-5 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-extrabold shadow-md"
            style={{
              backgroundColor: DARK,
              color: MINT,
            }}
          >
            ( Who I Am )
          </span>
        </motion.div>

        {/* Main Heading */}
        <div ref={headingRef} className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight max-w-4xl mx-auto tracking-[-0.02em]"
            style={{ color: DARK }}
          >
            Providing high-level{" "}
            <span className="relative inline-block" style={{ color: DARK }}>
              real estate consulting
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 6C50 2 150 2 198 6"
                  stroke={GREEN}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
            , with a focus on data-driven insights, personalized service, and a{" "}
            <span style={{ color: TEAL }}>smooth, stress-free transaction experience.</span>
          </h2>
        </div>

        {/* Image Grid */}
        <div
          ref={imagesRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20"
        >
          {images.map((img, index) => (
            <motion.div
              key={index}
              className="about-image relative group cursor-pointer"
              initial={{
                opacity: 0,
                y: 50,
                rotate: frameVariants[index % 4].rotate,
              }}
              whileInView={{
                opacity: 1,
                y: frameVariants[index % 4].y,
                rotate: frameVariants[index % 4].rotate,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                y: -10,
                zIndex: 10,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
            >
              <div
                className="p-2 sm:p-3 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `2px solid ${TEAL}30`,
                }}
              >
                <div className="relative aspect-4/3 rounded-xl overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500"
                    style={{ backgroundColor: TEAL }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to top, ${DARK}40, transparent)`,
                    }}
                  />
                </div>
                <div className="mt-2 sm:mt-3 text-center">
                  <div
                    className="w-8 sm:w-10 h-1 rounded-full mx-auto transition-colors duration-500"
                    style={{ backgroundColor: TEAL }}
                  />
                </div>
              </div>
              <motion.div
                className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full group-hover:scale-125 transition-all duration-300"
                style={{ backgroundColor: `${GREEN}60` }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bio Section */}
        <div
          ref={bioRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
              <span
                className="inline-block rounded-md px-3 py-1 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold"
                style={{
                  backgroundColor: DARK,
                  color: MINT,
                }}
              >
                ( About Me )
              </span>
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 leading-tight"
              style={{ color: "#FFFFFF" }}
            >
              Hi, I&apos;m{" "}
              <span className="relative inline-block">
                <span style={{ color: MINT }}>Christopher Ryan</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6C50 2 150 2 198 6"
                    stroke={GREEN}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </span>
            </motion.h3>

            <motion.div
              variants={itemVariants}
              className="space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg leading-relaxed"
              style={{ color: "#FFFFFF" }}
            >
              <p>
                I provide real estate consulting services in the Northern Virginia Area. I offer all of my clients high-level consulting services that combine data aggregation with proprietary analytical methods while maintaining strict industry standards to ensure thorough preparation for every transaction.
              </p>

              <blockquote
                className="border-l-4 pl-4 py-2 rounded-r-lg italic"
                style={{
                  borderColor: MINT,
                  backgroundColor: `${DARK}40`,
                  color: "#FFFFFF",
                }}
              >
                "Real estate isn't just about properties — it's about people making informed decisions with confidence. My goal is to provide the strategic guidance needed to navigate today's complex market."
              </blockquote>

              <p>
                My approach to real estate consulting goes beyond traditional methods. By leveraging data-driven insights and proprietary constraints, I provide my clients with a competitive edge in the Northern Virginia market. Whether you're buying or selling, I ensure you have all the information you need to make strategic decisions.
              </p>
              <p>
                I specialize in both Seller and Buyer Agent Services. For sellers, I focus on positioning your property to attract the right buyers and maximize value. For buyers, I help you navigate the market with confidence, identifying opportunities that align with your goals and budget.
              </p>
              <p>
                What sets me apart is my commitment to combining analytical rigor with personalized service. Every client receives a customized strategy that addresses their unique needs and circumstances.
              </p>

              <p className="font-extrabold" style={{ color: MINT }}>
                Let's work together! <br /> Christopher Ryan
              </p>
            </motion.div>

            {/* CONTACT INFO - EMAIL, PHONE & ADDRESS */}
            <motion.div variants={itemVariants} className="mt-6 sm:mt-8">
              <div className="flex flex-col gap-3 sm:gap-4 font-medium text-xs sm:text-sm md:text-base">
                {/* Email - Separate Line */}
                <a
                  href="mailto:chris@margenau.com"
                  className="hover:scale-105 transition-all flex items-center gap-2 group"
                  style={{ color: "#FFFFFF" }}
                >
                  <span
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${MINT}30`,
                      border: `1px solid ${MINT}60`,
                    }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: MINT }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </span>
                  <span className="truncate group-hover:underline" style={{ color: "#FFFFFF" }}>
                    chris@margenau.com
                  </span>
                </a>

                {/* Phone - Separate Line */}
                <a
                  href="tel:(202) 848-4567"
                  className="hover:scale-105 transition-all flex items-center gap-2 group"
                  style={{ color: "#FFFFFF" }}
                >
                  <span
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${GREEN}30`,
                      border: `1px solid ${GREEN}60`,
                    }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: GREEN }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </span>
                  <span className="group-hover:underline" style={{ color: "#FFFFFF" }}>
                    (202) 848-4567
                  </span>
                </a>

                {/* Address - Separate Line */}
                <div
                  className="flex items-center gap-2 group"
                  style={{ color: "#FFFFFF" }}
                >
                  <span
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${DARK}40`,
                      border: `1px solid ${MINT}40`,
                    }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: MINT }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <span style={{ color: "#FFFFFF" }}>
                    20830 Gleedsville Rd. Leesburg, VA 20175
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 sm:mt-8">
              <p
                className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-3 sm:mb-4"
                style={{ color: MINT }}
              >
                ( Connect With Me )
              </p>
              <div className="flex items-center gap-2.5 sm:gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: `${MINT}40`,
                      border: `1px solid ${MINT}60`,
                      color: "#FFFFFF",
                    }}
                    whileHover={{
                      scale: 1.1,
                      y: -3,
                      backgroundColor: social.hoverColor,
                      borderColor: social.hoverColor,
                      color: "#FFFFFF",
                    }}
                    transition={{ duration: 0.2 }}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ===== PROFESSIONAL PORTRAIT IMAGE DESIGN ===== */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle background accent - just one large shape */}
              <div
                className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl opacity-30 -z-10"
                style={{ backgroundColor: MINT }}
              />

              {/* Main Portrait Container */}
              <div
                className="relative aspect-3/4 rounded-2xl overflow-hidden"
                style={{
                  boxShadow: `
                    0 25px 50px -12px ${DARK}80,
                    0 10px 20px -5px ${TEAL}40
                  `,
                }}
              >
                <Image
                  src="/images/chirsaboutpic.png"
                  alt="Christopher Ryan"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 45vw"
                  priority={false}
                />

                {/* Subtle color grade overlay - professional look */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, transparent 50%, ${DARK}90 100%)`,
                  }}
                />

                {/* Very subtle teal tint for brand cohesion */}
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    background: `linear-gradient(135deg, ${TEAL} 0%, transparent 100%)`,
                  }}
                />
              </div>

              {/* Thin elegant border frame - slightly offset */}
              <div
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 aspect-3/4 w-full rounded-2xl -z-10"
                style={{
                  border: `2px solid ${TEAL}`,
                }}
              />

              {/* NAME PLATE - Professional Magazine Style */}
              <motion.div
                className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-4 sm:bottom-6 rounded-xl px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-md shadow-xl"
                style={{
                  backgroundColor: `${DARK}E6`,
                  border: `1px solid ${MINT}40`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <p className="text-base sm:text-lg lg:text-xl font-extrabold" style={{ color: "#FFFFFF" }}>
                  Christopher Ryan
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="h-0.5 w-6 sm:w-8 rounded-full"
                    style={{ backgroundColor: GREEN }}
                  />
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: MINT }}>
                    Real Estate Consultant
                  </p>
                </div>
              </motion.div>

              {/* Top Right Badge - Realtor Since */}
              <motion.div
                className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 rounded-2xl shadow-xl p-3 sm:p-4"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: `0 10px 30px ${DARK}40`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: TEAL }}>
                  Since
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold leading-none mt-0.5" style={{ color: TEAL }}>
                  2025
                </p>
              </motion.div>

              {/* Top Right - Trusted Badge (minimal) */}
              <motion.div
                className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 backdrop-blur-md flex items-center gap-1.5"
                style={{
                  backgroundColor: `${GREEN}E6`,
                  border: `1px solid #FFFFFF60`,
                }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                  fill="#FFFFFF"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider" style={{ color: "#FFFFFF" }}>
                  Trusted
                </span>
              </motion.div>

              {/* Small accent line at bottom */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full -z-10"
                style={{ backgroundColor: GREEN }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}