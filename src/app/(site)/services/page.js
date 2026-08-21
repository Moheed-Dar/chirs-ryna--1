// "use client";

// import { useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ShieldCheck,
//   BarChart3,
//   Target,
//   Check,
//   ArrowRight,
//   BookOpen,
//   Download,
//   FileText,
//   Users,
//   TrendingUp,
//   Home,
//   Search,
//   Scale,
//   Star,
// } from "lucide-react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import GuideForm from "@/components/forms/GuideForm";

// gsap.registerPlugin(ScrollTrigger);

// // ============================================
// // SERVICES DATA (Updated Colors)
// // ============================================
// const services = [
//   {
//     icon: ShieldCheck,
//     title: "Buyer & Seller Representation",
//     description:
//       "Expert legal and strategic representation through every stage of your property transaction. We protect your interests from first offer to final closing.",
//     features: [
//       "Skilled negotiation on your behalf",
//       "Legal documentation & compliance",
//       "Market-driven pricing strategy",
//       "End-to-end closing support",
//     ],
//   },
//   {
//     icon: BarChart3,
//     title: "Home Valuations",
//     description:
//       "Accurate, data-driven property valuations backed by comprehensive market analysis. Know the true worth of your asset before making any decision.",
//     features: [
//       "Comparative market analysis (CMA)",
//       "Current market trend evaluation",
//       "Detailed valuation report",
//       "Fair & transparent pricing",
//     ],
//   },
//   {
//     icon: Target,
//     title: "Investment Advisory",
//     description:
//       "Strategic real estate investment guidance to help you identify high-return opportunities and build a profitable property portfolio with managed risk.",
//     features: [
//       "Portfolio diversification strategy",
//       "ROI projection & analysis",
//       "Emerging market identification",
//       "Risk assessment & mitigation",
//     ],
//   },
// ];

// // ============================================
// // GUIDE DATA (Updated Colors)
// // ============================================
// const guides = [
//   {
//     type: "buyer",
//     title: "Buyer's Guide",
//     description:
//       "Everything you need to know before purchasing your dream property. A step-by-step roadmap for first-time and experienced buyers.",
//     contents: [
//       "Complete buying process explained",
//       "Financing options & mortgage tips",
//       "Property inspection checklist",
//       "Common mistakes to avoid",
//       "Negotiation strategies that work",
//     ],
//     icon: Home,
//   },
//   {
//     type: "seller",
//     title: "Seller's Guide",
//     description:
//       "Maximize your property's value with our proven selling strategies. Learn how to attract the right buyers and close at the best price.",
//     contents: [
//       "How to price your property right",
//       "Home staging & preparation tips",
//       "Marketing strategies that sell",
//       "Negotiation tactics for sellers",
//       "Legal requirements simplified",
//     ],
//     icon: TrendingUp,
//   },
// ];

// // ============================================
// // MAIN PAGE
// // ============================================
// export default function ServicesPage() {
//   const pageRef = useRef(null);
//   const servicesRef = useRef(null);
//   const guidesRef = useRef(null);

//   // ---- GSAP Animations ----
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Hero
//       gsap.fromTo(
//         ".hero-title",
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
//       );
//       gsap.fromTo(
//         ".hero-sub",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
//       );
//       gsap.fromTo(
//         ".hero-line",
//         { scaleX: 0 },
//         { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
//       );

//       // Service Cards
//       gsap.fromTo(
//         ".service-card",
//         { opacity: 0, y: 40 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.15,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: servicesRef.current,
//             start: "top 85%",
//           },
//         }
//       );

//       // Guide Cards
//       gsap.fromTo(
//         ".guide-card",
//         { opacity: 0, y: 40 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.15,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: guidesRef.current,
//             start: "top 85%",
//           },
//         }
//       );
//     }, pageRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div
//       ref={pageRef}
//       className="min-h-screen bg-[#301143] relative overflow-x-hidden"
//     >
//       {/* ===== LIGHTER BACKGROUND EFFECTS + WATERMARK ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "40px 40px",
//           }}
//         />
//         {/* Watermark logo (subtle) */}
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
//           <div className="relative w-75 h-75 sm:w-100 sm:h-100">
//             <Image
//               src="/images/logo.png"
//               alt="Watermark"
//               fill
//               className="object-contain"
//               unoptimized
//             />
//           </div>
//         </div>
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(250,174,98,0.10)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(250,174,98,0.08)_0%,transparent_50%)]" />
//       </div>

//       {/* ===== HERO SECTION ===== */}
//       <div className="relative z-10 mt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
//           <div className="max-w-3xl mx-auto">
//             <div className="hero-line flex items-center justify-center gap-3 mb-6 origin-left">
//               <div className="w-8 h-px bg-linear-to-r from-[#FAAE62] to-transparent" />
//               <span className="text-[10px] font-bold text-[#FAAE62] uppercase tracking-[0.3em]">
//                 What We Offer
//               </span>
//               <div className="w-8 h-px bg-linear-to-l from-[#FAAE62] to-transparent" />
//             </div>

//             <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6 font-bold">
//               Our{" "}
//               <span className="text-[#FAAE62]">
//                 Services
//               </span>
//             </h1>

//             <p className="hero-sub text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
//               Comprehensive real estate solutions tailored to your needs. From
//               finding your dream home to maximizing your investment returns.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ===== SERVICES SECTION ===== */}
//       <div ref={servicesRef} className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {services.map((service, index) => {
//               const Icon = service.icon;
//               return (
//                 <div
//                   key={index}
//                   className="service-card group relative bg-[#4a1d60] rounded-2xl p-7 sm:p-8 border border-white/10 hover:border-[#FAAE62]/40 transition-all duration-500 overflow-hidden"
//                 >
//                   {/* Subtle glow */}
//                   <div
//                     className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
//                     style={{ backgroundColor: "#FAAE62" }}
//                   />

//                   <div
//                     className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#FAAE62]/20 bg-[#FAAE62]/10 transition-all duration-500 group-hover:scale-110"
//                   >
//                     <Icon
//                       size={24}
//                       className="text-[#FAAE62] transition-transform duration-500 group-hover:scale-110"
//                     />
//                   </div>

//                   <h3 className="relative text-xl text-white mb-3 leading-tight font-semibold">
//                     {service.title}
//                   </h3>

//                   <p className="relative text-white/70 text-sm leading-relaxed mb-6">
//                     {service.description}
//                   </p>

//                   <ul className="relative space-y-2.5">
//                     {service.features.map((feature, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-2.5 text-sm text-white/70"
//                       >
//                         <div
//                           className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-[#FAAE62]/20 bg-[#FAAE62]/10 transition-colors duration-300"
//                         >
//                           <Check
//                             size={10}
//                             className="text-[#FAAE62]"
//                           />
//                         </div>
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="relative mt-7 pt-5 border-t border-white/10">
//                     <Link
//                       href="/contact"
//                       className="inline-flex items-center gap-2 text-sm font-semibold text-[#FAAE62] transition-all duration-300 group/link"
//                     >
//                       Learn More
//                       <ArrowRight
//                         size={14}
//                         className="transition-transform duration-300 group-hover/link:translate-x-1"
//                       />
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ===== GUIDES DOWNLOAD SECTION ===== */}
//       <div ref={guidesRef} className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
//           <div className="text-center mb-14">
//             <div className="flex items-center justify-center gap-3 mb-5">
//               <div className="w-8 h-px bg-linear-to-r from-[#FAAE62] to-transparent" />
//               <span className="text-[10px] font-bold text-[#FAAE62] uppercase tracking-[0.3em]">
//                 Free Resources
//               </span>
//               <div className="w-8 h-px bg-linear-to-l from-[#FAAE62] to-transparent" />
//             </div>

//             <h2 className="text-3xl sm:text-4xl text-white tracking-tight leading-[1.1] mb-4 font-bold">
//               Download Our{" "}
//               <span className="text-[#FAAE62]">
//                 Free Guides
//               </span>
//             </h2>

//             <p className="text-white/70 text-base max-w-xl mx-auto">
//               Comprehensive resources to help you make informed real estate
//               decisions. Download instantly after filling a quick form.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             {guides.map((guide) => {
//               const GuideIcon = guide.icon;
//               return (
//                 <div
//                   key={guide.type}
//                   className="guide-card group relative bg-[#4a1d60] rounded-2xl border border-white/10 hover:border-[#FAAE62]/40 transition-all duration-500"
//                 >
//                   {/* Subtle glow */}
//                   <div
//                     className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
//                     style={{ backgroundColor: "#FAAE62" }}
//                   />

//                   <div className="relative p-7 sm:p-8">
//                     <div className="flex items-start justify-between mb-5">
//                       <div
//                         className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#FAAE62]/20 bg-[#FAAE62]/10 transition-all duration-500 group-hover:scale-110"
//                       >
//                         <GuideIcon size={22} className="text-[#FAAE62]" />
//                       </div>
//                       <span
//                         className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#FAAE62]/20 bg-[#FAAE62]/10 text-[#FAAE62]"
//                       >
//                         Free PDF
//                       </span>
//                     </div>

//                     <h3 className="text-xl text-white mb-2 font-semibold">
//                       {guide.title}
//                     </h3>
//                     <p className="text-white/70 text-sm leading-relaxed mb-5">
//                       {guide.description}
//                     </p>

//                     <ul className="space-y-2 mb-7">
//                       {guide.contents.map((item, i) => (
//                         <li
//                           key={i}
//                           className="flex items-center gap-2.5 text-xs text-white/60"
//                         >
//                           <div
//                             className="w-1 h-1 rounded-full shrink-0 bg-[#FAAE62]"
//                           />
//                           {item}
//                         </li>
//                       ))}
//                     </ul>

//                     <GuideForm guideType={guide.type} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="text-center mt-10">
//             <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full">
//               <ShieldCheck size={14} className="text-[#FAAE62]/60" />
//               <span className="text-xs text-white/50">
//                 Your information is secure. We never share your data.
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ShieldCheck,
//   BarChart3,
//   Target,
//   Check,
//   ArrowRight,
//   BookOpen,
//   Download,
//   FileText,
//   Users,
//   TrendingUp,
//   Home,
//   Search,
//   Scale,
//   Star,
// } from "lucide-react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import GuideForm from "@/components/forms/GuideForm";

// gsap.registerPlugin(ScrollTrigger);

// // ============================================
// // SERVICES DATA
// // ============================================
// const services = [
//   {
//     icon: ShieldCheck,
//     title: "Buyer & Seller Representation",
//     description:
//       "Expert legal and strategic representation through every stage of your property transaction. We protect your interests from first offer to final closing.",
//     features: [
//       "Skilled negotiation on your behalf",
//       "Legal documentation & compliance",
//       "Market-driven pricing strategy",
//       "End-to-end closing support",
//     ],
//   },
//   {
//     icon: BarChart3,
//     title: "Home Valuations",
//     description:
//       "Accurate, data-driven property valuations backed by comprehensive market analysis. Know the true worth of your asset before making any decision.",
//     features: [
//       "Comparative market analysis (CMA)",
//       "Current market trend evaluation",
//       "Detailed valuation report",
//       "Fair & transparent pricing",
//     ],
//   },
//   {
//     icon: Target,
//     title: "Investment Advisory",
//     description:
//       "Strategic real estate investment guidance to help you identify high-return opportunities and build a profitable property portfolio with managed risk.",
//     features: [
//       "Portfolio diversification strategy",
//       "ROI projection & analysis",
//       "Emerging market identification",
//       "Risk assessment & mitigation",
//     ],
//   },
// ];

// // ============================================
// // GUIDE DATA
// // ============================================
// const guides = [
//   {
//     type: "buyer",
//     title: "Buyer's Guide",
//     description:
//       "Everything you need to know before purchasing your dream property. A step-by-step roadmap for first-time and experienced buyers.",
//     contents: [
//       "Complete buying process explained",
//       "Financing options & mortgage tips",
//       "Property inspection checklist",
//       "Common mistakes to avoid",
//       "Negotiation strategies that work",
//     ],
//     icon: Home,
//   },
//   {
//     type: "seller",
//     title: "Seller's Guide",
//     description:
//       "Maximize your property's value with our proven selling strategies. Learn how to attract the right buyers and close at the best price.",
//     contents: [
//       "How to price your property right",
//       "Home staging & preparation tips",
//       "Marketing strategies that sell",
//       "Negotiation tactics for sellers",
//       "Legal requirements simplified",
//     ],
//     icon: TrendingUp,
//   },
// ];

// // ============================================
// // MAIN PAGE
// // ============================================
// export default function ServicesPage() {
//   const pageRef = useRef(null);
//   const servicesRef = useRef(null);
//   const guidesRef = useRef(null);

//   // ---- GSAP Animations ----
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Hero
//       gsap.fromTo(
//         ".hero-title",
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
//       );
//       gsap.fromTo(
//         ".hero-sub",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
//       );
//       gsap.fromTo(
//         ".hero-line",
//         { scaleX: 0 },
//         { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
//       );

//       // Service Cards
//       gsap.fromTo(
//         ".service-card",
//         { opacity: 0, y: 40 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.15,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: servicesRef.current,
//             start: "top 85%",
//           },
//         }
//       );

//       // Guide Cards
//       gsap.fromTo(
//         ".guide-card",
//         { opacity: 0, y: 40 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.15,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: guidesRef.current,
//             start: "top 85%",
//           },
//         }
//       );
//     }, pageRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div
//       ref={pageRef}
//       className="min-h-screen bg-[#301143] relative overflow-x-hidden"
//     >
//       {/* ===== LIGHTER BACKGROUND EFFECTS + WATERMARK ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "40px 40px",
//           }}
//         />
//         {/* Watermark logo (subtle) */}
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
//           <div className="relative w-75 h-75 sm:w-100 sm:h-100">
//             <Image
//               src="/images/logo3.png"
//               alt="Watermark"
//               fill
//               className="object-contain"
//               unoptimized
//             />
//           </div>
//         </div>
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(250,174,98,0.10)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(250,174,98,0.08)_0%,transparent_50%)]" />
//       </div>

//       {/* ===== HERO SECTION ===== */}
//       <div className="relative z-10 mt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
//           <div className="max-w-3xl mx-auto">
//             <div className="hero-line flex items-center justify-center gap-3 mb-6 origin-left">
//               <div className="w-8 h-px bg-linear-to-r from-[#FAAE62] to-transparent" />
//               <span className="text-[10px] font-bold text-[#FAAE62] uppercase tracking-[0.3em]">
//                 What We Offer
//               </span>
//               <div className="w-8 h-px bg-linear-to-l from-[#FAAE62] to-transparent" />
//             </div>

//             <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6 font-bold">
//               Our <span className="text-[#FAAE62]">Services</span>
//             </h1>

//             <p className="hero-sub text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
//               Comprehensive real estate solutions tailored to your needs. From
//               finding your dream home to maximizing your investment returns.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ===== SERVICES SECTION ===== */}
//       <div ref={servicesRef} className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {services.map((service, index) => {
//               const Icon = service.icon;
//               return (
//                 <div
//                   key={index}
//                   className="service-card group relative bg-[#4a1d60] rounded-2xl p-7 sm:p-8 border border-white/10 hover:border-[#FAAE62]/40 transition-all duration-500 overflow-hidden"
//                 >
//                   {/* Subtle glow */}
//                   <div
//                     className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
//                     style={{ backgroundColor: "#FAAE62" }}
//                   />

//                   <div
//                     className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-[#FAAE62]/20 bg-[#FAAE62]/10 transition-all duration-500 group-hover:scale-110"
//                   >
//                     <Icon
//                       size={24}
//                       className="text-[#FAAE62] transition-transform duration-500 group-hover:scale-110"
//                     />
//                   </div>

//                   <h3 className="relative text-xl text-white mb-3 leading-tight font-semibold">
//                     {service.title}
//                   </h3>

//                   <p className="relative text-white/70 text-sm leading-relaxed mb-6">
//                     {service.description}
//                   </p>

//                   <ul className="relative space-y-2.5">
//                     {service.features.map((feature, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-2.5 text-sm text-white/70"
//                       >
//                         <div
//                           className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-[#FAAE62]/20 bg-[#FAAE62]/10 transition-colors duration-300"
//                         >
//                           <Check size={10} className="text-[#FAAE62]" />
//                         </div>
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="relative mt-7 pt-5 border-t border-white/10">
//                     <Link
//                       href="/contact"
//                       className="inline-flex items-center gap-2 text-sm font-semibold text-[#FAAE62] transition-all duration-300 group/link"
//                     >
//                       Learn More
//                       <ArrowRight
//                         size={14}
//                         className="transition-transform duration-300 group-hover/link:translate-x-1"
//                       />
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ===== GUIDES DOWNLOAD SECTION ===== */}
//       <div ref={guidesRef} className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
//           <div className="text-center mb-14">
//             <div className="flex items-center justify-center gap-3 mb-5">
//               <div className="w-8 h-px bg-linear-to-r from-[#FAAE62] to-transparent" />
//               <span className="text-[10px] font-bold text-[#FAAE62] uppercase tracking-[0.3em]">
//                 Free Resources
//               </span>
//               <div className="w-8 h-px bg-linear-to-l from-[#FAAE62] to-transparent" />
//             </div>

//             <h2 className="text-3xl sm:text-4xl text-white tracking-tight leading-[1.1] mb-4 font-bold">
//               Download Our <span className="text-[#FAAE62]">Free Guides</span>
//             </h2>

//             <p className="text-white/70 text-base max-w-xl mx-auto">
//               Comprehensive resources to help you make informed real estate
//               decisions. Download instantly after filling a quick form.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             {guides.map((guide) => {
//               const GuideIcon = guide.icon;
//               return (
//                 <div
//                   key={guide.type}
//                   className="guide-card group relative bg-[#4a1d60] rounded-2xl border border-white/10 hover:border-[#FAAE62]/40 transition-all duration-500"
//                 >
//                   {/* Subtle glow */}
//                   <div
//                     className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
//                     style={{ backgroundColor: "#FAAE62" }}
//                   />

//                   <div className="relative p-7 sm:p-8">
//                     <div className="flex items-start justify-between mb-5">
//                       <div
//                         className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#FAAE62]/20 bg-[#FAAE62]/10 transition-all duration-500 group-hover:scale-110"
//                       >
//                         <GuideIcon size={22} className="text-[#FAAE62]" />
//                       </div>
//                       <span
//                         className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#FAAE62]/20 bg-[#FAAE62]/10 text-[#FAAE62]"
//                       >
//                         Free PDF
//                       </span>
//                     </div>

//                     <h3 className="text-xl text-white mb-2 font-semibold">
//                       {guide.title}
//                     </h3>
//                     <p className="text-white/70 text-sm leading-relaxed mb-5">
//                       {guide.description}
//                     </p>

//                     <ul className="space-y-2 mb-7">
//                       {guide.contents.map((item, i) => (
//                         <li
//                           key={i}
//                           className="flex items-center gap-2.5 text-xs text-white/60"
//                         >
//                           <div className="w-1 h-1 rounded-full shrink-0 bg-[#FAAE62]" />
//                           {item}
//                         </li>
//                       ))}
//                     </ul>

//                     <GuideForm guideType={guide.type} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="text-center mt-10">
//             <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full">
//               <ShieldCheck size={14} className="text-[#FAAE62]/60" />
//               <span className="text-xs text-white/50">
//                 Your information is secure. We never share your data.
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ShieldCheck,
//   BarChart3,
//   Target,
//   Check,
//   ArrowRight,
//   BookOpen,
//   Download,
//   FileText,
//   Users,
//   TrendingUp,
//   Home,
//   Search,
//   Scale,
//   Star,
// } from "lucide-react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import GuideForm from "@/components/forms/GuideForm";

// gsap.registerPlugin(ScrollTrigger);

// // ==========================================
// // ✅ COLOR PALETTE
// // ==========================================
// const TURQUOISE = "#20B2B8";
// const LIGHT_AQUA = "#BEEBF0";
// const DARK_PINK = "#D81B60";
// const DARK_ORANGE = "#F2673A";
// const PEACH = "#FFC8B5";
// const WARM_CREAM = "#FFF7F0";
// const WARM_TAUPE = "#D9D2C7";
// const NAVY = "#1F2D3D";

// const NAVY_LIGHT = "#263848";
// const NAVY_DARK = "#172636";
// const NAVY_CARD = "#1E3040";

// const CREAM_30 = "#FFF7F04D";
// const CREAM_40 = "#FFF7F066";
// const CREAM_50 = "#FFF7F080";
// const CREAM_60 = "#FFF7F099";
// const CREAM_70 = "#FFF7F0B3";
// const CREAM_75 = "#FFF7F0BF";
// const CREAM_80 = "#FFF7F0CC";
// const CREAM_90 = "#FFF7F0E6";

// // ============================================
// // SERVICES DATA
// // ============================================
// const services = [
//   {
//     icon: ShieldCheck,
//     title: "Buyer & Seller Representation",
//     description:
//       "Expert guidance and personalized representation through every stage of your real estate journey. Whether you're buying, selling, or both, we help you make informed decisions with confidence and peace of mind.",
//     features: [
//       "Skilled negotiation on your behalf",
//       "Strategic pricing & market analysis",
//       "Professional marketing & exposure",
//       "Support from consultation to closing",
//     ],
//   },
//   {
//     icon: BarChart3,
//     title: "Home Valuations",
//     description:
//       "Know what your home is worth with a comprehensive market evaluation. We provide honest advice and local market expertise so you can plan your next move with confidence.",
//     features: [
//       "Accurate comparative market analysis",
//       "Current Northern Virginia market insights",
//       "Pricing strategies for today's market",
//       "No-obligation consultation",
//     ],
//   },
//   {
//     icon: Target,
//     title: "Downsizing Services",
//     description:
//       "Moving to a home that better fits your lifestyle is about more than buying and selling. We provide personalized guidance to help make your transition as smooth and stress-free as possible.",
//     features: [
//       "Customized downsizing plan",
//       "Neighbourhood & lifestyle guidance",
//       "Trusted local professional referrals",
//       "Step-by-step support from start to finish",
//     ],
//   },
// ];

// // ============================================
// // GUIDE DATA
// // ============================================
// const guides = [
//   {
//     type: "buyer",
//     title: "Buyer's Guide",
//     description:
//       "Everything you need to know before purchasing your dream property. A step-by-step roadmap for first-time and experienced buyers.",
//     contents: [
//       "Complete buying process explained",
//       "Financing options & mortgage tips",
//       "Property inspection checklist",
//       "Common mistakes to avoid",
//       "Negotiation strategies that work",
//     ],
//     icon: Home,
//   },
//   {
//     type: "seller",
//     title: "Seller's Guide",
//     description:
//       "Maximize your property's value with our proven selling strategies. Learn how to attract the right buyers and close at the best price.",
//     contents: [
//       "How to price your property right",
//       "Home staging & preparation tips",
//       "Marketing strategies that sell",
//       "Negotiation tactics for sellers",
//       "Legal requirements simplified",
//     ],
//     icon: TrendingUp,
//   },
// ];

// // ============================================
// // MAIN PAGE
// // ============================================
// export default function ServicesPage() {
//   const pageRef = useRef(null);
//   const servicesRef = useRef(null);
//   const guidesRef = useRef(null);

//   // ---- GSAP Animations ----
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".hero-title",
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
//       );
//       gsap.fromTo(
//         ".hero-sub",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
//       );
//       gsap.fromTo(
//         ".hero-line",
//         { scaleX: 0 },
//         { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
//       );

//       gsap.fromTo(
//         ".service-card",
//         { opacity: 0, y: 40 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.15,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: servicesRef.current,
//             start: "top 85%",
//           },
//         }
//       );

//       gsap.fromTo(
//         ".guide-card",
//         { opacity: 0, y: 40 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.6,
//           stagger: 0.15,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: guidesRef.current,
//             start: "top 85%",
//           },
//         }
//       );
//     }, pageRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div
//       ref={pageRef}
//       className="min-h-screen relative overflow-x-hidden"
//       style={{ backgroundColor: NAVY }}
//     >
//       {/* ===== BACKGROUND EFFECTS + WATERMARK ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, ${TURQUOISE} 1px, transparent 0)`,
//             backgroundSize: "40px 40px",
//           }}
//         />
//         {/* Watermark logo */}
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
//           <div className="relative w-75 h-75 sm:w-100 sm:h-100">
//             <Image
//               src="/images/solidlogo11.png"
//               alt="Watermark"
//               fill
//               className="object-contain"
//               unoptimized
//             />
//           </div>
//         </div>
//         <div
//           className="absolute inset-0"
//           style={{
//             background: `radial-gradient(ellipse at top left, ${TURQUOISE}10 0%, transparent 40%)`,
//           }}
//         />
//         <div
//           className="absolute inset-0"
//           style={{
//             background: `radial-gradient(ellipse at bottom right, ${PEACH}08 0%, transparent 50%)`,
//           }}
//         />
//       </div>

//       {/* ===== HERO SECTION ===== */}
//       <div className="relative z-10 mt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
//           <div className="max-w-3xl mx-auto">
//             <div className="hero-line flex items-center justify-center gap-3 mb-6 origin-left">
//               <div
//                 className="w-8 h-px"
//                 style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
//               />
//               <span
//                 className="text-[10px] font-bold uppercase tracking-[0.3em]"
//                 style={{ color: TURQUOISE }}
//               >
//                 What We Offer
//               </span>
//               <div
//                 className="w-8 h-px"
//                 style={{ background: `linear-gradient(to left, ${TURQUOISE}, transparent)` }}
//               />
//             </div>

//             <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6 font-bold">
//               Our <span style={{ color: TURQUOISE }}>Services</span>
//             </h1>

//             <p
//               className="hero-sub text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
//               style={{ color: CREAM_70 }}
//             >
//               Comprehensive real estate solutions tailored to your needs. From
//               finding your dream home to maximizing your investment returns.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ===== SERVICES SECTION ===== */}
//       <div ref={servicesRef} className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {services.map((service, index) => {
//               const Icon = service.icon;
//               return (
//                 <div
//                   key={index}
//                   className="service-card group relative rounded-2xl p-7 sm:p-8 transition-all duration-500 overflow-hidden"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.borderColor = `${TURQUOISE}40`;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.borderColor = `${WARM_CREAM}10`;
//                   }}
//                 >
//                   {/* Subtle glow */}
//                   <div
//                     className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
//                     style={{ backgroundColor: TURQUOISE }}
//                   />

//                   <div
//                     className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
//                     style={{
//                       border: `1px solid ${TURQUOISE}20`,
//                       backgroundColor: `${TURQUOISE}10`,
//                     }}
//                   >
//                     <Icon
//                       size={24}
//                       style={{ color: TURQUOISE }}
//                       className="transition-transform duration-500 group-hover:scale-110"
//                     />
//                   </div>

//                   <h3 className="relative text-xl text-white mb-3 leading-tight font-semibold">
//                     {service.title}
//                   </h3>

//                   <p className="relative text-sm leading-relaxed mb-6" style={{ color: CREAM_70 }}>
//                     {service.description}
//                   </p>

//                   <ul className="relative space-y-2.5">
//                     {service.features.map((feature, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-2.5 text-sm"
//                         style={{ color: CREAM_70 }}
//                       >
//                         <div
//                           className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300"
//                           style={{
//                             border: `1px solid ${TURQUOISE}20`,
//                             backgroundColor: `${TURQUOISE}10`,
//                           }}
//                         >
//                           <Check size={10} style={{ color: TURQUOISE }} />
//                         </div>
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div
//                     className="relative mt-7 pt-5"
//                     style={{ borderTop: `1px solid ${WARM_CREAM}10` }}
//                   >
//                     <Link
//                       href="/contact"
//                       className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group/link"
//                       style={{ color: TURQUOISE }}
//                     >
//                       Learn More
//                       <ArrowRight
//                         size={14}
//                         className="transition-transform duration-300 group-hover/link:translate-x-1"
//                       />
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ===== GUIDES DOWNLOAD SECTION ===== */}
//       <div ref={guidesRef} className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
//           <div className="text-center mb-14">
//             <div className="flex items-center justify-center gap-3 mb-5">
//               <div
//                 className="w-8 h-px"
//                 style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
//               />
//               <span
//                 className="text-[10px] font-bold uppercase tracking-[0.3em]"
//                 style={{ color: TURQUOISE }}
//               >
//                 Free Resources
//               </span>
//               <div
//                 className="w-8 h-px"
//                 style={{ background: `linear-gradient(to left, ${TURQUOISE}, transparent)` }}
//               />
//             </div>

//             <h2 className="text-3xl sm:text-4xl text-white tracking-tight leading-[1.1] mb-4 font-bold">
//               Download Our <span style={{ color: TURQUOISE }}>Free Guides</span>
//             </h2>

//             <p className="text-base max-w-xl mx-auto" style={{ color: CREAM_70 }}>
//               Comprehensive resources to help you make informed real estate
//               decisions. Download instantly after filling a quick form.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             {guides.map((guide) => {
//               const GuideIcon = guide.icon;
//               return (
//                 <div
//                   key={guide.type}
//                   className="guide-card group relative rounded-2xl transition-all duration-500"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.borderColor = `${TURQUOISE}40`;
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.borderColor = `${WARM_CREAM}10`;
//                   }}
//                 >
//                   {/* Subtle glow */}
//                   <div
//                     className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
//                     style={{ backgroundColor: TURQUOISE }}
//                   />

//                   <div className="relative p-7 sm:p-8">
//                     <div className="flex items-start justify-between mb-5">
//                       <div
//                         className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
//                         style={{
//                           border: `1px solid ${TURQUOISE}20`,
//                           backgroundColor: `${TURQUOISE}10`,
//                         }}
//                       >
//                         <GuideIcon size={22} style={{ color: TURQUOISE }} />
//                       </div>
//                       <span
//                         className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
//                         style={{
//                           border: `1px solid ${TURQUOISE}20`,
//                           backgroundColor: `${TURQUOISE}10`,
//                           color: TURQUOISE,
//                         }}
//                       >
//                         Free PDF
//                       </span>
//                     </div>

//                     <h3 className="text-xl text-white mb-2 font-semibold">
//                       {guide.title}
//                     </h3>
//                     <p className="text-sm leading-relaxed mb-5" style={{ color: CREAM_70 }}>
//                       {guide.description}
//                     </p>

//                     <ul className="space-y-2 mb-7">
//                       {guide.contents.map((item, i) => (
//                         <li
//                           key={i}
//                           className="flex items-center gap-2.5 text-xs"
//                           style={{ color: CREAM_60 }}
//                         >
//                           <div
//                             className="w-1 h-1 rounded-full shrink-0"
//                             style={{ backgroundColor: TURQUOISE }}
//                           />
//                           {item}
//                         </li>
//                       ))}
//                     </ul>

//                     <GuideForm guideType={guide.type} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="text-center mt-10">
//             <div
//               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
//               style={{
//                 backgroundColor: `${WARM_CREAM}05`,
//                 border: `1px solid ${WARM_CREAM}10`,
//               }}
//             >
//               <ShieldCheck size={14} style={{ color: `${TURQUOISE}60` }} />
//               <span className="text-xs" style={{ color: CREAM_50 }}>
//                 Your information is secure. We never share your data.
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  BarChart3,
  Target,
  Check,
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  Users,
  TrendingUp,
  Home,
  Search,
  Scale,
  Star,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GuideForm from "@/components/forms/GuideForm";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// ✅ UPDATED COLOR PALETTE
// ==========================================
const TEAL = "#019586";
const DARK_TEAL = "#014D41";
const MINT = "#B1F1E9";
const BRIGHT_CYAN = "#04D3C7";

// Derived colors from new palette
const NAVY = "#0A2D28";
const NAVY_LIGHT = "#0F3D36";
const NAVY_DARK = "#06211D";
const NAVY_CARD = "#0D332D";

// Creamy White with opacity helpers
const CREAM_30 = "#B1F1E94D";
const CREAM_40 = "#B1F1E966";
const CREAM_50 = "#B1F1E980";
const CREAM_60 = "#B1F1E999";
const CREAM_70 = "#B1F1E9B3";
const CREAM_75 = "#B1F1E9BF";
const CREAM_80 = "#B1F1E9CC";
const CREAM_90 = "#B1F1E9E6";

// ============================================
// SERVICES DATA
// ============================================
const services = [
  {
    icon: ShieldCheck,
    title: "Buyer Representation",
    description:
      "Personalized guidance throughout your home-buying journey. We help you find the right property, evaluate opportunities, negotiate confidently, and navigate every step through closing.",
    features: [
      "Property search & selection guidance",
      "Market analysis & property evaluation",
      "Skilled negotiation on your behalf",
      "Support from consultation to closing",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Seller Representation",
    description:
      "A strategic approach to selling your property with confidence. From pricing and preparation to marketing and negotiations, we help position your property to attract qualified buyers and achieve the best possible outcome.",
    features: [
      "Strategic pricing & market analysis",
      "Professional property marketing & exposure",
      "Skilled negotiation with buyers",
      "Support from listing to closing",
    ],
  },
  {
    icon: BarChart3,
    title: "Home Valuations",
    description:
      "Know what your home is worth with a comprehensive market evaluation. We provide honest advice and local market expertise so you can plan your next move with confidence.",
    features: [
      "Accurate comparative market analysis",
      "Current Northern Virginia market insights",
      "Pricing strategies for today's market",
      "No-obligation consultation",
    ],
  },
  // {
  //   icon: Target,
  //   title: "Downsizing Services",
  //   description:
  //     "Moving to a home that better fits your lifestyle is about more than buying and selling. We provide personalized guidance to help make your transition as smooth and stress-free as possible.",
  //   features: [
  //     "Customized downsizing plan",
  //     "Neighbourhood & lifestyle guidance",
  //     "Trusted local professional referrals",
  //     "Step-by-step support from start to finish",
  //   ],
  // },
];

// ============================================
// GUIDE DATA
// ============================================
const guides = [
  {
    type: "buyer",
    title: "Buyer's Guide",
    description:
      "Everything you need to know before purchasing your dream property. A step-by-step roadmap for first-time and experienced buyers.",
    contents: [
      "Complete buying process explained",
      "Financing options & mortgage tips",
      "Property inspection checklist",
      "Common mistakes to avoid",
      "Negotiation strategies that work",
    ],
    icon: Home,
  },
  {
    type: "seller",
    title: "Seller's Guide",
    description:
      "Maximize your property's value with our proven selling strategies. Learn how to attract the right buyers and close at the best price.",
    contents: [
      "How to price your property right",
      "Home staging & preparation tips",
      "Marketing strategies that sell",
      "Negotiation tactics for sellers",
      "Legal requirements simplified",
    ],
    icon: TrendingUp,
  },
];

// ============================================
// MAIN PAGE
// ============================================
export default function ServicesPage() {
  const pageRef = useRef(null);
  const servicesRef = useRef(null);
  const guidesRef = useRef(null);

  // ---- GSAP Animations ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 },
      );
      gsap.fromTo(
        ".hero-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.1 },
      );

      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 85%",
          },
        },
      );

      gsap.fromTo(
        ".guide-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: guidesRef.current,
            start: "top 85%",
          },
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: NAVY }}
    >
      {/* ===== BACKGROUND EFFECTS + WATERMARK ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${TEAL} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Watermark logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <div className="relative w-75 h-75 sm:w-100 sm:h-100">
            <Image
              src="/images/solidlogo11.png"
              alt="Watermark"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top left, ${TEAL}10 0%, transparent 40%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at bottom right, ${MINT}08 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="hero-line flex items-center justify-center gap-3 mb-6 origin-left">
              <div
                className="w-8 h-px"
                style={{
                  background: `linear-gradient(to right, ${TEAL}, transparent)`,
                }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: TEAL }}
              >
                What We Offer
              </span>
              <div
                className="w-8 h-px"
                style={{
                  background: `linear-gradient(to left, ${TEAL}, transparent)`,
                }}
              />
            </div>

            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-6 font-bold">
              Our <span style={{ color: TEAL }}>Services</span>
            </h1>

            <p
              className="hero-sub text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: CREAM_70 }}
            >
              Comprehensive real estate solutions tailored to your needs. From
              finding your dream home to maximizing your investment returns.
            </p>
          </div>
        </div>
      </div>

      {/* ===== SERVICES SECTION ===== */}
      <div ref={servicesRef} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="service-card group relative rounded-2xl p-7 sm:p-8 transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${MINT}10`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${TEAL}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${MINT}10`;
                  }}
                >
                  {/* Subtle glow */}
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: TEAL }}
                  />

                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                    style={{
                      border: `1px solid ${TEAL}20`,
                      backgroundColor: `${TEAL}10`,
                    }}
                  >
                    <Icon
                      size={24}
                      style={{ color: TEAL }}
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="relative text-xl text-white mb-3 leading-tight font-semibold">
                    {service.title}
                  </h3>

                  <p
                    className="relative text-sm leading-relaxed mb-6"
                    style={{ color: CREAM_70 }}
                  >
                    {service.description}
                  </p>

                  <ul className="relative space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: CREAM_70 }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300"
                          style={{
                            border: `1px solid ${TEAL}20`,
                            backgroundColor: `${TEAL}10`,
                          }}
                        >
                          <Check size={10} style={{ color: TEAL }} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="relative mt-7 pt-5"
                    style={{ borderTop: `1px solid ${MINT}10` }}
                  >
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group/link"
                      style={{ color: TEAL }}
                    >
                      Learn More
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== GUIDES DOWNLOAD SECTION ===== */}
      <div ref={guidesRef} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div
                className="w-8 h-px"
                style={{
                  background: `linear-gradient(to right, ${TEAL}, transparent)`,
                }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: TEAL }}
              >
                Free Resources
              </span>
              <div
                className="w-8 h-px"
                style={{
                  background: `linear-gradient(to left, ${TEAL}, transparent)`,
                }}
              />
            </div>

            <h2 className="text-3xl sm:text-4xl text-white tracking-tight leading-[1.1] mb-4 font-bold">
              Download Our <span style={{ color: TEAL }}>Free Guides</span>
            </h2>

            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: CREAM_70 }}
            >
              Comprehensive resources to help you make informed real estate
              decisions. Download instantly after filling a quick form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guides.map((guide) => {
              const GuideIcon = guide.icon;
              return (
                <div
                  key={guide.type}
                  className="guide-card group relative rounded-2xl transition-all duration-500"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${MINT}10`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${TEAL}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${MINT}10`;
                  }}
                >
                  {/* Subtle glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: TEAL }}
                  />

                  <div className="relative p-7 sm:p-8">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                        style={{
                          border: `1px solid ${TEAL}20`,
                          backgroundColor: `${TEAL}10`,
                        }}
                      >
                        <GuideIcon size={22} style={{ color: TEAL }} />
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          border: `1px solid ${TEAL}20`,
                          backgroundColor: `${TEAL}10`,
                          color: TEAL,
                        }}
                      >
                        Free PDF
                      </span>
                    </div>

                    <h3 className="text-xl text-white mb-2 font-semibold">
                      {guide.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-5"
                      style={{ color: CREAM_70 }}
                    >
                      {guide.description}
                    </p>

                    <ul className="space-y-2 mb-7">
                      {guide.contents.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-xs"
                          style={{ color: CREAM_60 }}
                        >
                          <div
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{ backgroundColor: TEAL }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <GuideForm guideType={guide.type} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{
                backgroundColor: `${MINT}05`,
                border: `1px solid ${MINT}10`,
              }}
            >
              <ShieldCheck size={14} style={{ color: `${TEAL}60` }} />
              <span className="text-xs" style={{ color: CREAM_50 }}>
                Your information is secure. We never share your data.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
