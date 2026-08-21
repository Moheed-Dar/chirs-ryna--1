// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
//   Phone,
//   Mail,
//   MessageSquare,
//   Clock,
//   CheckCircle2,
//   ArrowRight,
//   ShieldCheck,
//   Home,
//   Building2,
//   Briefcase,
//   PhoneCall,
// } from "lucide-react";
// import ContactForm from "@/components/forms/ContactForm";

// // ============================================
// // DATA
// // ============================================
// const FAQS = [
//   {
//     q: "How quickly do you respond to inquiries?",
//     a: "We typically respond within 24 hours during business days. For urgent matters, please call us directly.",
//   },
//   {
//     q: "Do you charge any consultation fee?",
//     a: "No, our initial consultation is completely free. We believe in building trust first.",
//   },
//   {
//     q: "Can I schedule a property visit?",
//     a: "Absolutely! Just mention the property you're interested in and we'll arrange a visit at your convenience.",
//   },
// ];

// const SERVICES = [
//   {
//     icon: Home,
//     title: "Buy Property",
//     desc: "Find your dream home from our verified listings across premium locations.",
//   },
//   {
//     icon: Building2,
//     title: "Sell Property",
//     desc: "List your property and reach thousands of potential buyers instantly.",
//   },
//   {
//     icon: Briefcase,
//     title: "Property Management",
//     desc: "Complete property management and tenant handling services.",
//   },
//   {
//     icon: MessageSquare,
//     title: "Legal Assistance",
//     desc: "Expert legal guidance for property documentation and transfers.",
//   },
// ];

// const QUICK_LINKS = [
//   { label: "Browse Properties", href: "/properties" },
//   { label: "About Us", href: "/about" },
//   { label: "Home", href: "/" },
// ];

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function ContactPage() {
//   return (
//     <div className="min-h-screen bg-[#39518A] relative overflow-x-hidden">
//       {/* ===== BACKGROUND TEXTURE + WATERMARK ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "40px 40px",
//           }}
//         />
//         {/* Watermark logo */}
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
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.12)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.08)_0%,transparent_50%)]" />
//       </div>

//       {/* ===== HERO SECTION ===== */}
//       <div className="relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
//             <Link href="/" className="hover:text-white transition-colors">
//               Home
//             </Link>
//             <span className="text-white/30">/</span>
//             <span className="text-white/80">Contact</span>
//           </div>

//           <div className="max-w-2xl">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-8 h-px bg-linear-to-r from-[#2B7FFF] to-transparent" />
//               <span className="text-[10px] font-bold text-[#2B7FFF] uppercase tracking-[0.25em]">
//                 Get In Touch
//               </span>
//             </div>
//             <h1 className="text-3xl sm:text-4xl lg:text-[4.25rem] text-white tracking-tight leading-[1.15] mb-4 font-bold">
//               Contact Us
//             </h1>
//             <p className="text-white/70 text-sm sm:text-[15px] leading-relaxed">
//               Have a question about a property or need expert advice? Our
//               dedicated team is ready to help you find your perfect investment.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ===== FORM + SIDEBAR ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
//           {/* LEFT – FORM */}
//           <div className="lg:col-span-2">
//             <div className="relative isolate bg-[#1b3454] rounded-2xl border border-white/10 overflow-hidden">
//               {/* Blur layers – only on desktop */}
//               <div className="hidden md:block absolute top-0 left-0 w-48 h-48 bg-[#2B7FFF]/6 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/2 pointer-events-none" />
//               <div className="hidden md:block absolute bottom-0 right-0 w-48 h-48 bg-[#2B7FFF]/6 rounded-full blur-3xl translate-x-1/3 translate-y-1/2 pointer-events-none" />

//               <div className="relative z-10 p-5 sm:p-7">
//                 <ContactForm />
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDEBAR */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-28 space-y-4">
//               {/* Why Contact Us */}
//               <div className="relative hidden md:block isolate bg-[#1b3454] rounded-2xl p-5 border border-white/10 overflow-hidden">
//                 <div className="hidden md:block absolute top-0 right-0 w-28 h-28 bg-[#2B7FFF]/8 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//                 <div className="relative z-10">
//                   <h3 className="text-base text-white mb-1 font-bold">
//                     Why Contact Us?
//                   </h3>
//                   <div className="w-10 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4" />
//                   <div className="space-y-3">
//                     {[
//                       {
//                         title: "Expert Guidance",
//                         desc: "Personalized recommendations based on your budget & preferences.",
//                       },
//                       {
//                         title: "Verified Listings",
//                         desc: "All properties verified by our team for your peace of mind.",
//                       },
//                       {
//                         title: "Best Deals",
//                         desc: "Exclusive off-market properties & early bird offers.",
//                       },
//                       {
//                         title: "Free Consultation",
//                         desc: "No hidden fees, completely free to start.",
//                       },
//                     ].map((item, i) => (
//                       <div key={i} className="flex items-start gap-2.5">
//                         <div className="w-5 h-5 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 mt-0.5 border border-[#2B7FFF]/20">
//                           <CheckCircle2
//                             size={11}
//                             className="text-[#2B7FFF]/80"
//                           />
//                         </div>
//                         <div>
//                           <p className="text-[13px] font-semibold text-white/80">
//                             {item.title}
//                           </p>
//                           <p className="text-[11px] text-white/50 leading-snug mt-0.5">
//                             {item.desc}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Our Services */}
//               <div className="relative isolate bg-[#1b3454] rounded-2xl p-5 border border-white/10 overflow-hidden">
//                 <div className="hidden md:block absolute top-0 left-0 w-28 h-28 bg-[#2B7FFF]/6 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Building2 size={13} className="text-[#2B7FFF]/80" />
//                     <h4 className="text-[9px] font-bold text-white/50 uppercase tracking-[0.25em]">
//                       Our Services
//                     </h4>
//                   </div>
//                   <div className="space-y-2">
//                     {SERVICES.map((item, i) => (
//                       <Link
//                         key={i}
//                         href="/services"
//                         className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-[#2B7FFF]/10 hover:border-[#2B7FFF]/25 hover:scale-[1.02] transition-all"
//                       >
//                         <div className="w-7 h-7 rounded-lg bg-[#2B7FFF]/15 flex items-center justify-center shrink-0">
//                           <item.icon size={13} className="text-[#2B7FFF]/80" />
//                         </div>
//                         <div>
//                           <p className="text-[13px] font-semibold text-white/80">
//                             {item.title}
//                           </p>
//                           <p className="text-[11px] text-white/50 leading-snug">
//                             {item.desc}
//                           </p>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== MORE INFO SECTION ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
//         <div className="text-center mb-10">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#2B7FFF]/30 to-transparent" />
//             <span className="text-[10px] font-bold text-[#2B7FFF] uppercase tracking-[0.25em]">
//               More Info
//             </span>
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#2B7FFF]/30 to-transparent" />
//           </div>
//           <h2 className="text-2xl sm:text-3xl text-white font-bold">
//             Quick Access
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Emergency Contact */}
//           <div className="relative hidden md:block isolate bg-[#1b3454] rounded-2xl p-5 border border-red-500/20 overflow-hidden group hover:border-red-500/30 transition-colors">
//             <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-red-500/15 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//             <div className="relative z-10">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/25">
//                   <PhoneCall size={15} className="text-red-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-red-300">Call Now</p>
//                   <p className="text-[11px] text-white/50 mt-0.5">
//                     Urgent inquiries
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 px-3 py-2 bg-red-500/15 rounded-lg border border-red-500/20">
//                 <Phone size={12} className="text-red-400/80" />
//                 <span className="text-xs font-semibold text-red-300">
//                   +1 226 932 5002
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Office Hours */}
//           <div className="relative hidden md:block isolate bg-[#1b3454] rounded-2xl p-5 border border-white/10 overflow-hidden hover:border-[#2B7FFF]/20 transition-colors">
//             <div className="hidden md:block absolute bottom-0 left-0 w-20 h-20 bg-[#2B7FFF]/6 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
//             <div className="relative z-10">
//               <div className="flex items-center gap-2 mb-3">
//                 <Clock size={14} className="text-[#2B7FFF]/80" />
//                 <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
//                   Office Hours
//                 </h4>
//               </div>
//               <div className="space-y-2">
//                 {[
//                   { day: "Mon - Fri", time: "9 AM - 7 PM", active: true },
//                   { day: "Saturday", time: "10 AM - 5 PM", active: true },
//                   { day: "Sunday", time: "Closed", active: false },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between py-1.5"
//                   >
//                     <span
//                       className={`text-xs ${item.active ? "text-white/70" : "text-white/30"}`}
//                     >
//                       {item.day}
//                     </span>
//                     <span
//                       className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
//                         item.active
//                           ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/20"
//                           : "bg-white/10 text-white/40 border border-white/10"
//                       }`}
//                     >
//                       {item.time}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="relative isolate bg-[#1b3454] rounded-2xl p-5 border border-white/10 overflow-hidden hover:border-[#2B7FFF]/20 transition-colors">
//             <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//             <div className="relative z-10">
//               <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-3">
//                 Quick Links
//               </h4>
//               <div className="space-y-1">
//                 {QUICK_LINKS.map((link, i) => (
//                   <Link
//                     key={i}
//                     href={link.href}
//                     className="flex items-center justify-between group py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/10 transition-colors"
//                   >
//                     <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
//                       {link.label}
//                     </span>
//                     <ArrowRight
//                       size={11}
//                       className="text-white/30 group-hover:text-[#2B7FFF]/70 group-hover:translate-x-0.5 transition-all"
//                     />
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Trusted Agency */}
//           <div className="relative hidden md:block isolate bg-[#1b3454] rounded-2xl p-5 border border-[#2B7FFF]/20 overflow-hidden hover:border-[#2B7FFF]/30 transition-colors">
//             <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#2B7FFF]/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
//             <div className="relative z-10">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-9 h-9 rounded-full bg-[#2B7FFF]/20 flex items-center justify-center shrink-0 border border-[#2B7FFF]/25">
//                   <ShieldCheck size={16} className="text-[#2B7FFF]" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-[#2B7FFF]">
//                     Trusted Agency
//                   </p>
//                   <p className="text-[11px] text-white/50">Since 2020</p>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 {["Verified Listings", "Secure Deals", "Happy Clients"].map(
//                   (tag, i) => (
//                     <div key={i} className="flex items-center gap-2">
//                       <div className="w-4 h-4 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0">
//                         <CheckCircle2 size={9} className="text-[#2B7FFF]/80" />
//                       </div>
//                       <span className="text-[11px] text-white/50">{tag}</span>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== FAQ SECTION – STATIC ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
//         <div className="text-center mb-10">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#2B7FFF]/30 to-transparent" />
//             <span className="text-[10px] font-bold text-[#2B7FFF] uppercase tracking-[0.25em]">
//               Common Questions
//             </span>
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#2B7FFF]/30 to-transparent" />
//           </div>
//           <h2 className="text-2xl sm:text-3xl text-white font-bold">
//             Frequently Asked Questions
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {FAQS.map((faq, index) => (
//             <div
//               key={index}
//               className="relative isolate bg-[#1b3454] rounded-2xl p-6 border border-white/10 overflow-hidden hover:border-[#2B7FFF]/20 transition-colors group"
//             >
//               <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#2B7FFF]/8 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
//               <div className="relative z-10">
//                 <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/15 flex items-center justify-center mb-3 border border-[#2B7FFF]/20">
//                   <span className="text-[#2B7FFF] font-bold text-sm">
//                     {index + 1}
//                   </span>
//                 </div>
//                 <h3 className="text-base text-white mb-2 leading-snug font-bold">
//                   {faq.q}
//                 </h3>
//                 <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }






// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Phone,
//   Mail,
//   MessageSquare,
//   Clock,
//   CheckCircle2,
//   ArrowRight,
//   ShieldCheck,
//   Home,
//   Building2,
//   Briefcase,
//   PhoneCall,
// } from "lucide-react";
// import ContactForm from "@/components/forms/ContactForm";

// // ============================================
// // DATA
// // ============================================
// const FAQS = [
//   {
//     q: "How quickly do you respond to inquiries?",
//     a: "We typically respond within 24 hours during business days. For urgent matters, please call us directly.",
//   },
//   {
//     q: "Do you charge any consultation fee?",
//     a: "No, our initial consultation is completely free. We believe in building trust first.",
//   },
//   {
//     q: "Can I schedule a property visit?",
//     a: "Absolutely! Just mention the property you're interested in and we'll arrange a visit at your convenience.",
//   },
// ];

// const SERVICES = [
//   {
//     icon: Home,
//     title: "Buy Property",
//     desc: "Find your dream home with expert guidance & local market knowledge.",
//   },
//   {
//     icon: Building2,
//     title: "Sell Property",
//     desc: "Maximize your home's value with a proven marketing strategy.",
//   },
//   {
//     icon: Briefcase,
//     title: "Downsize with Confidence",
//     desc: "Simplify your move with personalized planning & support.",
//   },
//   {
//     icon: MessageSquare,
//     title: "Relocate to Northern Virginia",
//     desc: "Discover the right neighbourhood to match your lifestyle & goals.",
//   },
// ];

// const QUICK_LINKS = [
//   { label: "Browse Properties", href: "/properties" },
//   { label: "About Us", href: "/about" },
//   { label: "Home", href: "/" },
// ];

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function ContactPage() {
//   return (
//     <div className="min-h-screen bg-[#1F2D3D] relative overflow-x-hidden">
//       {/* ===== BACKGROUND TEXTURE + WATERMARK ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, #FFF7F0 1px, transparent 0)",
//             backgroundSize: "40px 40px",
//           }}
//         />
//         {/* Watermark logo */}
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.3]">
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
//         {/* Using Turquoise and Peach for the ambient radial glows */}
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(32,178,184,0.15)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,200,181,0.12)_0%,transparent_50%)]" />
//       </div>

//       {/* ===== HERO SECTION ===== */}
//       <div className="relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="flex items-center gap-2 text-sm text-[#FFF7F0]/50 mb-8">
//             <Link href="/" className="hover:text-[#FFF7F0] transition-colors">
//               Home
//             </Link>
//             <span className="text-[#FFF7F0]/30">/</span>
//             <span className="text-[#FFF7F0]/80">Contact</span>
//           </div>
//           <div className="max-w-2xl">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-8 h-px bg-linear-to-r from-[#20B2B8] to-transparent" />
//               <span className="text-[10px] font-bold text-[#20B2B8] uppercase tracking-[0.25em]">
//                 Get In Touch
//               </span>
//             </div>
//             <h1 className="text-3xl sm:text-4xl lg:text-[4.25rem] text-[#FFF7F0] tracking-tight leading-[1.15] mb-4 font-bold">
//               Contact Us
//             </h1>
//             <p className="text-[#FFF7F0]/70 text-sm sm:text-[15px] leading-relaxed">
//               Have a question about a property or need expert advice? Our
//               dedicated team is ready to help you find your perfect investment.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ===== FORM + SIDEBAR ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
//           {/* LEFT – FORM */}
//           <div className="lg:col-span-2">
//             <div className="relative isolate bg-[#1E3040] rounded-2xl border border-[#FFF7F0]/10 overflow-hidden">
//               {/* Blur layers - using Turquoise and Dark Orange for vibrancy */}
//               <div className="hidden md:block absolute top-0 left-0 w-48 h-48 bg-[#20B2B8]/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/2 pointer-events-none" />
//               <div className="hidden md:block absolute bottom-0 right-0 w-48 h-48 bg-[#F2673A]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/2 pointer-events-none" />
//               <div className="relative z-10 p-5 sm:p-7">
//                 <ContactForm />
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDEBAR */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-28 space-y-4">
//               {/* Why Contact Us */}
//               <div className="relative hidden md:block isolate bg-[#1E3040] rounded-2xl p-5 border border-[#FFF7F0]/10 overflow-hidden">
//                 <div className="hidden md:block absolute top-0 right-0 w-28 h-28 bg-[#20B2B8]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//                 <div className="relative z-10">
//                   <h3 className="text-base text-[#FFF7F0] mb-1 font-bold">
//                     Why Contact Us?
//                   </h3>
//                   <div className="w-10 h-0.5 bg-linear-to-r from-[#20B2B8] to-transparent rounded-full mb-4" />
//                   <div className="space-y-3">
//                     {[
//                       {
//                         title: "Expert Guidance",
//                         desc: "Personalized recommendations based on your budget & preferences.",
//                       },
//                       {
//                         title: "A Clear Plan",
//                         desc: "Tailored to your goals & timelines",
//                       },
//                       {
//                         title: "Honest Advice",
//                         desc: "Straightforward insights to help you make confident decisions.",
//                       },
//                       {
//                         title: "Dedicated Support",
//                         desc: "Guidance every step of the way, from start to finish."
//                       },
//                     ].map((item, i) => (
//                       <div key={i} className="flex items-start gap-2.5">
//                         <div className="w-5 h-5 rounded-full bg-[#20B2B8]/15 flex items-center justify-center shrink-0 mt-0.5 border border-[#20B2B8]/20">
//                           <CheckCircle2 size={11} className="text-[#20B2B8]/80" />
//                         </div>
//                         <div>
//                           <p className="text-[13px] font-semibold text-[#FFF7F0]/80">
//                             {item.title}
//                           </p>
//                           <p className="text-[11px] text-[#FFF7F0]/50 leading-snug mt-0.5">
//                             {item.desc}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Our Services */}
//               <div className="relative isolate bg-[#1E3040] rounded-2xl p-5 border border-[#FFF7F0]/10 overflow-hidden">
//                 <div className="hidden md:block absolute top-0 left-0 w-28 h-28 bg-[#20B2B8]/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Building2 size={13} className="text-[#20B2B8]/80" />
//                     <h4 className="text-[9px] font-bold text-[#FFF7F0]/50 uppercase tracking-[0.25em]">
//                       Our Services
//                     </h4>
//                   </div>
//                   <div className="space-y-2">
//                     {SERVICES.map((item, i) => (
//                       <Link
//                         key={i}
//                         href="/services"
//                         className="flex items-center gap-3 p-2 bg-[#FFF7F0]/5 rounded-lg border border-[#FFF7F0]/10 hover:bg-[#20B2B8]/10 hover:border-[#20B2B8]/25 hover:scale-[1.02] transition-all"
//                       >
//                         <div className="w-7 h-7 rounded-lg bg-[#20B2B8]/15 flex items-center justify-center shrink-0">
//                           <item.icon size={13} className="text-[#20B2B8]/80" />
//                         </div>
//                         <div>
//                           <p className="text-[13px] font-semibold text-[#FFF7F0]/80">
//                             {item.title}
//                           </p>
//                           <p className="text-[11px] text-[#FFF7F0]/50 leading-snug">
//                             {item.desc}
//                           </p>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== MORE INFO SECTION ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
//         <div className="text-center mb-10">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#20B2B8]/30 to-transparent" />
//             <span className="text-[10px] font-bold text-[#20B2B8] uppercase tracking-[0.25em]">
//               More Info
//             </span>
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#20B2B8]/30 to-transparent" />
//           </div>
//           <h2 className="text-2xl sm:text-3xl text-[#FFF7F0] font-bold">
//             Quick Access
//           </h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Emergency Contact - Using Dark Pink */}
//           <div className="relative hidden md:block isolate bg-[#1E3040] rounded-2xl p-5 border border-[#D81B60]/20 overflow-hidden group hover:border-[#D81B60]/30 transition-colors">
//             <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#D81B60]/15 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//             <div className="relative z-10">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-8 h-8 rounded-full bg-[#D81B60]/20 flex items-center justify-center shrink-0 border border-[#D81B60]/25">
//                   <PhoneCall size={15} className="text-[#D81B60]/80" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-[#D81B60]">Call Now</p>
//                   <p className="text-[11px] text-[#FFF7F0]/50 mt-0.5">
//                     Urgent inquiries
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 px-3 py-2 bg-[#D81B60]/15 rounded-lg border border-[#D81B60]/20">
//                 <Phone size={12} className="text-[#D81B60]/80" />
//                 <span className="text-xs font-semibold text-[#D81B60]">
//                   (202) 848-4567
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Office Hours - Using Turquoise */}
//           <div className="relative hidden md:block isolate bg-[#1E3040] rounded-2xl p-5 border border-[#FFF7F0]/10 overflow-hidden hover:border-[#20B2B8]/20 transition-colors">
//             <div className="hidden md:block absolute bottom-0 left-0 w-20 h-20 bg-[#20B2B8]/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
//             <div className="relative z-10">
//               <div className="flex items-center gap-2 mb-3">
//                 <Clock size={14} className="text-[#20B2B8]/80" />
//                 <h4 className="text-[10px] font-bold text-[#FFF7F0]/50 uppercase tracking-[0.2em]">
//                   Office Hours
//                 </h4>
//               </div>
//               <div className="space-y-2">
//                 {[
//                   { day: "Mon - Fri", time: "9 AM - 7 PM", active: true },
//                   { day: "Saturday", time: "10 AM - 5 PM", active: true },
//                   { day: "Sunday", time: "Closed", active: false },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between py-1.5"
//                   >
//                     <span
//                       className={`text-xs ${item.active ? "text-[#FFF7F0]/70" : "text-[#FFF7F0]/30"}`}
//                     >
//                       {item.day}
//                     </span>
//                     <span
//                       className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
//                         item.active
//                           ? "bg-[#20B2B8]/15 text-[#20B2B8] border border-[#20B2B8]/20"
//                           : "bg-[#FFF7F0]/10 text-[#FFF7F0]/40 border border-[#FFF7F0]/10"
//                       }`}
//                     >
//                       {item.time}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Quick Links - Using Dark Orange */}
//           <div className="relative isolate bg-[#1E3040] rounded-2xl p-5 border border-[#FFF7F0]/10 overflow-hidden hover:border-[#20B2B8]/20 transition-colors">
//             <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#F2673A]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
//             <div className="relative z-10">
//               <h4 className="text-[10px] font-bold text-[#FFF7F0]/50 uppercase tracking-[0.2em] mb-3">
//                 Quick Links
//               </h4>
//               <div className="space-y-1">
//                 {QUICK_LINKS.map((link, i) => (
//                   <Link
//                     key={i}
//                     href={link.href}
//                     className="flex items-center justify-between group py-1.5 px-2 -mx-2 rounded-lg hover:bg-[#FFF7F0]/10 transition-colors"
//                   >
//                     <span className="text-xs text-[#FFF7F0]/60 group-hover:text-[#FFF7F0]/80 transition-colors">
//                       {link.label}
//                     </span>
//                     <ArrowRight
//                       size={11}
//                       className="text-[#FFF7F0]/30 group-hover:text-[#20B2B8]/70 group-hover:translate-x-0.5 transition-all"
//                     />
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Trusted Agency - Using Turquoise */}
//           <div className="relative hidden md:block isolate bg-[#1E3040] rounded-2xl p-5 border border-[#20B2B8]/20 overflow-hidden hover:border-[#20B2B8]/30 transition-colors">
//             <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#20B2B8]/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
//             <div className="relative z-10">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-9 h-9 rounded-full bg-[#20B2B8]/20 flex items-center justify-center shrink-0 border border-[#20B2B8]/25">
//                   <ShieldCheck size={16} className="text-[#20B2B8]" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-[#20B2B8]">
//                     Trusted Agency
//                   </p>
//                   <p className="text-[11px] text-[#FFF7F0]/50">Since 2020</p>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 {["Verified Listings", "Secure Deals", "Happy Clients"].map(
//                   (tag, i) => (
//                     <div key={i} className="flex items-center gap-2">
//                       <div className="w-4 h-4 rounded-full bg-[#20B2B8]/15 flex items-center justify-center shrink-0">
//                         <CheckCircle2 size={9} className="text-[#20B2B8]/80" />
//                       </div>
//                       <span className="text-[11px] text-[#FFF7F0]/50">{tag}</span>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== FAQ SECTION ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
//         <div className="text-center mb-10">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#20B2B8]/30 to-transparent" />
//             <span className="text-[10px] font-bold text-[#20B2B8] uppercase tracking-[0.25em]">
//               Common Questions
//             </span>
//             <div className="w-12 h-px bg-linear-to-r from-transparent via-[#20B2B8]/30 to-transparent" />
//           </div>
//           <h2 className="text-2xl sm:text-3xl text-[#FFF7F0] font-bold">
//             Frequently Asked Questions
//           </h2>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {FAQS.map((faq, index) => (
//             <div
//               key={index}
//               className="relative isolate bg-[#1E3040] rounded-2xl p-6 border border-[#FFF7F0]/10 overflow-hidden hover:border-[#20B2B8]/20 transition-colors group"
//             >
//               <div className="hidden md:block absolute top-0 right-0 w-20 h-20 bg-[#20B2B8]/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
//               <div className="relative z-10">
//                 <div className="w-8 h-8 rounded-lg bg-[#20B2B8]/15 flex items-center justify-center mb-3 border border-[#20B2B8]/20">
//                   <span className="text-[#20B2B8] font-bold text-sm">
//                     {index + 1}
//                   </span>
//                 </div>
//                 <h3 className="text-base text-[#FFF7F0] mb-2 leading-snug font-bold">
//                   {faq.q}
//                 </h3>
//                 <p className="text-[#FFF7F0]/60 text-sm leading-relaxed">{faq.a}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }













"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Home,
  Building2,
  Briefcase,
  PhoneCall,
} from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

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
// DATA
// ============================================
const FAQS = [
  {
    q: "How quickly do you respond to inquiries?",
    a: "We typically respond within 24 hours during business days. For urgent matters, please call us directly.",
  },
  {
    q: "Do you charge any consultation fee?",
    a: "No, our initial consultation is completely free. We believe in building trust first.",
  },
  {
    q: "Can I schedule a property visit?",
    a: "Absolutely! Just mention the property you're interested in and we'll arrange a visit at your convenience.",
  },
];

const SERVICES = [
  {
    icon: Home,
    title: "Buy Property",
    desc: "Find your dream home with expert guidance & local market knowledge.",
  },
  {
    icon: Building2,
    title: "Sell Property",
    desc: "Maximize your home's value with a proven marketing strategy.",
  },
  {
    icon: Briefcase,
    title: "Downsize with Confidence",
    desc: "Simplify your move with personalized planning & support.",
  },
  {
    icon: MessageSquare,
    title: "Relocate to Northern Virginia",
    desc: "Discover the right neighbourhood to match your lifestyle & goals.",
  },
];

const QUICK_LINKS = [
  { label: "Browse Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
  { label: "Home", href: "/" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: NAVY }}>
      {/* ===== BACKGROUND TEXTURE + WATERMARK ===== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${MINT} 1px, transparent 0)`,
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
        {/* Using Teal and Mint for the ambient radial glows */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top left, ${TEAL}15 0%, transparent 40%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom right, ${MINT}08 0%, transparent 50%)` }} />
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: CREAM_50 }}>
            <Link href="/" className="hover:text-[#B1F1E9] transition-colors" style={{ color: CREAM_60 }}>
              Home
            </Link>
            <span style={{ color: CREAM_30 }}>/</span>
            <span style={{ color: CREAM_80 }}>Contact</span>
          </div>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: `linear-gradient(to right, ${TEAL}, transparent)` }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>
                Get In Touch
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[4.25rem] tracking-tight leading-[1.15] mb-4 font-bold" style={{ color: MINT }}>
              Contact Us
            </h1>
            <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: CREAM_70 }}>
              Have a question about a property or need expert advice? Our
              dedicated team is ready to help you find your perfect investment.
            </p>
          </div>
        </div>
      </div>

      {/* ===== FORM + SIDEBAR ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* LEFT – FORM */}
          <div className="lg:col-span-2">
            <div className="relative isolate rounded-2xl border overflow-hidden" style={{ backgroundColor: NAVY_CARD, borderColor: `${MINT}10` }}>
              {/* Blur layers */}
              <div className="hidden md:block absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/2 pointer-events-none" style={{ backgroundColor: `${TEAL}10` }} />
              <div className="hidden md:block absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl translate-x-1/3 translate-y-1/2 pointer-events-none" style={{ backgroundColor: `${BRIGHT_CYAN}10` }} />
              <div className="relative z-10 p-5 sm:p-7">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              {/* Why Contact Us */}
              <div className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden" style={{ backgroundColor: NAVY_CARD, borderColor: `${MINT}10` }}>
                <div className="hidden md:block absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ backgroundColor: `${TEAL}10` }} />
                <div className="relative z-10">
                  <h3 className="text-base mb-1 font-bold" style={{ color: MINT }}>
                    Why Contact Us?
                  </h3>
                  <div className="w-10 h-0.5 rounded-full mb-4" style={{ background: `linear-gradient(to right, ${TEAL}, transparent)` }} />
                  <div className="space-y-3">
                    {[
                      {
                        title: "Expert Guidance",
                        desc: "Personalized recommendations based on your budget & preferences.",
                      },
                      {
                        title: "A Clear Plan",
                        desc: "Tailored to your goals & timelines",
                      },
                      {
                        title: "Honest Advice",
                        desc: "Straightforward insights to help you make confident decisions.",
                      },
                      {
                        title: "Dedicated Support",
                        desc: "Guidance every step of the way, from start to finish."
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${TEAL}15`, border: `1px solid ${TEAL}20` }}>
                          <CheckCircle2 size={11} style={{ color: `${TEAL}80` }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: CREAM_80 }}>
                            {item.title}
                          </p>
                          <p className="text-[11px] leading-snug mt-0.5" style={{ color: CREAM_50 }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Our Services */}
              <div className="relative isolate rounded-2xl p-5 border overflow-hidden" style={{ backgroundColor: NAVY_CARD, borderColor: `${MINT}10` }}>
                <div className="hidden md:block absolute top-0 left-0 w-28 h-28 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ backgroundColor: `${TEAL}10` }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={13} style={{ color: `${TEAL}80` }} />
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: CREAM_50 }}>
                      Our Services
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {SERVICES.map((item, i) => (
                      <Link
                        key={i}
                        href="/services"
                        className="flex items-center gap-3 p-2 rounded-lg border transition-all"
                        style={{ backgroundColor: `${MINT}5`, borderColor: `${MINT}10` }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${TEAL}10`;
                          e.currentTarget.style.borderColor = `${TEAL}25`;
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${MINT}5`;
                          e.currentTarget.style.borderColor = `${MINT}10`;
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${TEAL}15` }}>
                          <item.icon size={13} style={{ color: `${TEAL}80` }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: CREAM_80 }}>
                            {item.title}
                          </p>
                          <p className="text-[11px] leading-snug" style={{ color: CREAM_50 }}>
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MORE INFO SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${TEAL}30, transparent)` }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>
              More Info
            </span>
            <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${TEAL}30, transparent)` }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: MINT }}>
            Quick Access
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Emergency Contact - Using Bright Cyan */}
          <div className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden group transition-colors" style={{ backgroundColor: NAVY_CARD, borderColor: `${BRIGHT_CYAN}20` }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${BRIGHT_CYAN}30` }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${BRIGHT_CYAN}20` }}>
            <div className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ backgroundColor: `${BRIGHT_CYAN}15` }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRIGHT_CYAN}20`, border: `1px solid ${BRIGHT_CYAN}25` }}>
                  <PhoneCall size={15} style={{ color: `${BRIGHT_CYAN}80` }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: BRIGHT_CYAN }}>Call Now</p>
                  <p className="text-[11px] mt-0.5" style={{ color: CREAM_50 }}>Urgent inquiries</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: `${BRIGHT_CYAN}15`, border: `1px solid ${BRIGHT_CYAN}20` }}>
                <Phone size={12} style={{ color: `${BRIGHT_CYAN}80` }} />
                <span className="text-xs font-semibold" style={{ color: BRIGHT_CYAN }}>(202) 848-4567</span>
              </div>
            </div>
          </div>

          {/* Office Hours - Using Teal */}
          <div className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden transition-colors" style={{ backgroundColor: NAVY_CARD, borderColor: `${MINT}10` }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${TEAL}20` }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${MINT}10` }}>
            <div className="hidden md:block absolute bottom-0 left-0 w-20 h-20 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 pointer-events-none" style={{ backgroundColor: `${TEAL}10` }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} style={{ color: `${TEAL}80` }} />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: CREAM_50 }}>
                  Office Hours
                </h4>
              </div>
              <div className="space-y-2">
                {[
                  { day: "Mon - Fri", time: "9 AM - 7 PM", active: true },
                  { day: "Saturday", time: "10 AM - 5 PM", active: true },
                  { day: "Sunday", time: "Closed", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className={`text-xs ${item.active ? "" : ""}`} style={{ color: item.active ? CREAM_70 : CREAM_30 }}>
                      {item.day}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.active ? "border" : ""}`} style={item.active ? { backgroundColor: `${TEAL}15`, color: TEAL, borderColor: `${TEAL}20` } : { backgroundColor: `${MINT}10`, color: CREAM_40, borderColor: `${MINT}10` }}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links - Using Teal */}
          <div className="relative isolate rounded-2xl p-5 border overflow-hidden transition-colors" style={{ backgroundColor: NAVY_CARD, borderColor: `${MINT}10` }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${TEAL}20` }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${MINT}10` }}>
            <div className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ backgroundColor: `${TEAL}10` }} />
            <div className="relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: CREAM_50 }}>
                Quick Links
              </h4>
              <div className="space-y-1">
                {QUICK_LINKS.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center justify-between group py-1.5 px-2 -mx-2 rounded-lg transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${MINT}10` }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                  >
                    <span className="text-xs transition-colors" style={{ color: CREAM_60 }} onMouseEnter={(e) => { e.currentTarget.style.color = CREAM_80 }} onMouseLeave={(e) => { e.currentTarget.style.color = CREAM_60 }}>
                      {link.label}
                    </span>
                    <ArrowRight size={11} className="transition-all" style={{ color: CREAM_30 }} onMouseEnter={(e) => { e.currentTarget.style.color = `${TEAL}70`; e.currentTarget.style.transform = "translateX(2px)" }} onMouseLeave={(e) => { e.currentTarget.style.color = CREAM_30; e.currentTarget.style.transform = "translateX(0)" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trusted Agency - Using Teal */}
          <div className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden transition-colors" style={{ backgroundColor: NAVY_CARD, borderColor: `${TEAL}20` }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${TEAL}30` }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${TEAL}20` }}>
            <div className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none" style={{ backgroundColor: `${TEAL}10` }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${TEAL}20`, border: `1px solid ${TEAL}25` }}>
                  <ShieldCheck size={16} style={{ color: TEAL }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: TEAL }}>Trusted Agency</p>
                  <p className="text-[11px]" style={{ color: CREAM_50 }}>Since 2020</p>
                </div>
              </div>
              <div className="space-y-2">
                {["Verified Listings", "Secure Deals", "Happy Clients"].map((tag, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${TEAL}15` }}>
                      <CheckCircle2 size={9} style={{ color: `${TEAL}80` }} />
                    </div>
                    <span className="text-[11px]" style={{ color: CREAM_50 }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FAQ SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${TEAL}30, transparent)` }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TEAL }}>
              Common Questions
            </span>
            <div className="w-12 h-px" style={{ background: `linear-gradient(to right, transparent, ${TEAL}30, transparent)` }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: MINT }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="relative isolate rounded-2xl p-6 border overflow-hidden transition-colors group"
              style={{ backgroundColor: NAVY_CARD, borderColor: `${MINT}10` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${TEAL}20` }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${MINT}10` }}
            >
              <div className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ backgroundColor: `${TEAL}10` }} />
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${TEAL}15`, border: `1px solid ${TEAL}20` }}>
                  <span className="font-bold text-sm" style={{ color: TEAL }}>{index + 1}</span>
                </div>
                <h3 className="text-base mb-2 leading-snug font-bold" style={{ color: MINT }}>
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: CREAM_60 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}