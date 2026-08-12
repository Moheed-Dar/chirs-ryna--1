"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const PinterestIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const imagesRef = useRef(null);
  const bioRef = useRef(null);

  const images = [
    { src: "/images/about4up.png", alt: "Ottawa Real Estate 1" },
    { src: "/images/about1up.jpg", alt: "Ottawa Real Estate 2" },
    { src: "/images/about3up.jpg", alt: "Ottawa Real Estate 3" },
    { src: "/images/about2up.jpg", alt: "Ottawa Real Estate 4" },
  ];

  const socialLinks = [
    {
      icon: FacebookIcon,
      href: " https://www.facebook.com/Christopher RyanConsultantrealtor/",
      label: "Facebook",
      color: "#208288",
    },
    {
      icon: InstagramIcon,
      href: " https://www.instagram.com/Christopher RyanConsultantrealtor/",
      label: "Instagram",
      color: "#DB1860",
    },
    {
      icon: YoutubeIcon,
      href: "https://www.youtube.com/@Christopher RyanConsultant",
      label: "YouTube",
      color: "#F2673A",
    },
    {
      icon: PinterestIcon,
      href: "https://www.pinterest.com/Christopher Ryan_Consultant/",
      label: "Pinterest",
      color: "#9D2C77",
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
      className="relative w-full overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      {/* ===== BACKGROUND: Navy → Turquoise → Aqua → Cream → Peach ===== */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #1F203D 0%, #208288 30%, #BEEBF0 55%, #FFF7F0 75%, #FCB855 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23BEEBF0' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
          className="text-center mb-4"
        >
          <span className="text-xs sm:text-sm text-[#BEEBF0]/80 uppercase tracking-[0.3em] font-medium">
            Who I Am
          </span>
        </motion.div>

        {/* Main Heading */}
        <div ref={headingRef} className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#BEEBF0]/90 leading-tight max-w-4xl mx-auto">
            Helping you embrace your next chapter with honest advice, local
            expertise, and a real estate experience that's thoughtful,
            personalized, and stress-free.
          </h2>
        </div>

        {/* Image Grid */}
        <div
          ref={imagesRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-20 sm:mb-28"
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
              <div className="bg-[#FFF7F0] p-3 sm:p-4 rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                <div className="relative aspect-4/3 rounded-xl overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-[#208288]/0 group-hover:bg-[#208288]/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-[#1F203D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="w-8 h-1 bg-[#BEEBF0] rounded-full mx-auto group-hover:bg-[#208288]/40 transition-colors duration-500" />
                </div>
              </div>
              <motion.div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F2673A]/30 group-hover:bg-[#F2673A]/60 transition-colors duration-300"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="text-xs text-[#BEEBF0]/80 uppercase tracking-[0.3em] font-medium">
                About Me
              </span>
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F2673A] mb-8 leading-tight"
            >
              Hey, Ottawa! I&apos;m{" "}
              <span className="relative">
                Christopher Ryan
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6C50 2 150 2 198 6"
                    stroke="#FCB855"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </svg>
              </span>
            </motion.h3>

            <motion.div
              variants={itemVariants}
              className="space-y-5 font-montserrat text-[#1F203D]/80 text-base sm:text-lg leading-relaxed"
            >
              <p>
                I'm a REALTOR® who believes real estate is about so much more than buying and selling homes—it's about helping people embrace their next chapter with confidence. Whether you're downsizing, buying your first home, or simply exploring your options, I'm here to provide honest advice, local expertise, and personalized guidance every step of the way. My goal is to make your experience feel less overwhelming and a whole lot more exciting.
              </p>

              <blockquote className="border-l-4 border-[#208288]/50 pl-4 py-2 bg-[#BEEBF0]/20 rounded-r-lg italic text-[#1F203D]/90">
                I spent much of my life starting over—moving eight times before finishing high school, born in Germany, started my early life on Prince Edward Island, and living in several small towns along the way. Those experiences taught me that home isn't just a place; it's a feeling.
              </blockquote>

              <p>
               For over 20 years, I worked in social/health services, helping women and families through some of the most difficult transitions of their lives. That experience taught me the importance of listening, staying calm, and helping people find hope during uncertain times.
              </p>
              <p>
                When I discovered real estate, I realized that buying and selling homes isn't really about real estate—it's about helping people navigate change, saying goodbye to one chapter while looking forward to the next.
              </p>
              <p>
                Today I specialize in helping Ottawa-area downsizers and have created the Smooth Transition Method to make the downsizing process feel clear, organized, and far less overwhelming.
              </p>

              <p className="font-semibold text-[#208288]">
                See you around town! <br /> Christopher Ryan
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[#1F203D]/70 font-medium">
                <a
                  href="mailto:Christopher Ryan@Christopher RyanConsultant.ca"
                  className="hover:text-[#208288] transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
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
                  Christopher Ryan@Christopher RyanConsultant.ca
                </a>
                <a
                  href="tel:16132914323"
                  className="hover:text-[#208288] transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
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
                  613-291-4323
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-xs text-[#9D2C77]/60 uppercase tracking-[0.2em] font-medium mb-4">
                Connect With Me
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl border border-[#BEEBF0]/50 bg-[#BEEBF0]/20 backdrop-blur-sm flex items-center justify-center text-[#1F203D]/70 transition-all duration-300"
                    whileHover={{
                      scale: 1.1,
                      y: -3,
                      backgroundColor: social.color,
                      borderColor: social.color,
                      color: "#FFF7F0",
                    }}
                    transition={{ duration: 0.2 }}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Portrait Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-3/4 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/shellyaboutimg.jpg"
                alt="Christopher Ryan"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1F203D]/30 via-transparent to-transparent" />
            </div>

            <motion.div
              className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-[#FFF7F0] rounded-2xl shadow-xl p-4 sm:p-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-3xl sm:text-4xl font-bold text-[#208288]">
                2015
              </p>
              <p className="text-xs sm:text-sm text-[#9D2C77]/60 mt-1">
                Realtor Since
              </p>
            </motion.div>

            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-[#FCB855]/20" />
            <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-[#F2673A]/5" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
