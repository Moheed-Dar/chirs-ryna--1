// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   MapPin,
//   Bed,
//   Bath,
//   ArrowLeft,
//   Phone,
//   Mail,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Building2,
//   Home,
//   CalendarDays,
//   Eye,
//   Check,
//   CheckCircle2,
//   Layers,
//   ZoomIn,
//   Ruler,
//   Tag,
//   ShieldCheck,
//   Grid3x3,
//   Image as ImageIcon,
//   Crown,
//   Gem,
//   Heart,
// } from "lucide-react";
// import { getPropertyById } from "@/lib/api";
// import { Playfair_Display, Inter } from "next/font/google";
// import LeadForm from "@/components/forms/LeadForm";

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   variable: "--font-playfair",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// // ============================================
// // SAFE IMAGE HELPER
// // ============================================
// const getSafeImage = (img) => {
//   if (!img) return null;
//   if (typeof img === "string") return img.trim();
//   if (typeof img === "object" && img?.url) return img.url.trim();
//   return null;
// };

// const PLACEHOLDER_IMG =
//   "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeImage, setActiveImage] = useState(0);
//   const [showLightbox, setShowLightbox] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [showLeadForm, setShowLeadForm] = useState(false);

//   const heroRef = useRef(null);

//   // ============================================
//   // FETCH
//   // ============================================
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         const res = await getPropertyById(id);
//         setProperty(res?.data || res);
//       } catch (err) {
//         setError("Property not found or removed");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProperty();
//   }, [id]);

//   // ============================================
//   // TRIGGER CSS ANIMATIONS ON MOUNT
//   // ============================================
//   useEffect(() => {
//     if (!property || loading) return;
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 80);
//     return () => clearTimeout(timer);
//   }, [property, loading]);

//   // ============================================
//   // SAFE IMAGES
//   // ============================================
//   const rawImages = property?.images || [];
//   const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
//   const mainImage =
//     getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

//   // ============================================
//   // IMAGE NAVIGATION
//   // ============================================
//   const nextImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev + 1) % images.length);
//   };
//   const prevImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!showLightbox) return;
//       if (e.key === "ArrowRight") nextImage();
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "Escape") setShowLightbox(false);
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showLightbox, images.length]);

//   // ============================================
//   // SHARE
//   // ============================================
//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: property?.title,
//         text: `Check out ${property?.title} at ${property?.location}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied!");
//     }
//   };

//   // ============================================
//   // LOADING
//   // ============================================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#39518A] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-5">
//           <div className="relative">
//             <div className="w-14 h-14 border-2 border-[#2B7FFF]/20 border-t-[#2B7FFF] rounded-full animate-spin" />
//             <Gem
//               size={16}
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2B7FFF]/60"
//             />
//           </div>
//           <p
//             className={`text-white/40 text-sm tracking-[0.2em] uppercase ${inter.variable} font-(family-name:--font-inter)`}
//           >
//             Loading property...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR
//   // ============================================
//   if (error || !property) {
//     return (
//       <div className="min-h-screen bg-[#39518A] flex flex-col items-center justify-center gap-4 px-4">
//         <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
//           <X size={32} className="text-white/40" />
//         </div>
//         <h2
//           className={`text-xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
//         >
//           Property Not Found
//         </h2>
//         <p className="text-white/50 text-sm text-center max-w-sm">{error}</p>
//         <Link
//           href="/properties"
//           className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF]/10 backdrop-blur-md border border-[#2B7FFF]/20 text-[#2B7FFF] text-sm font-semibold rounded-xl hover:bg-[#2B7FFF]/20 transition-colors"
//         >
//           <ArrowLeft size={16} /> Browse Properties
//         </Link>
//       </div>
//     );
//   }

//   const currentDisplayImage =
//     images.length > 0 ? images[activeImage] || mainImage : mainImage;
//   const hasSingleImage = images.length <= 1;

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <div
//       className={`min-h-screen bg-[#39518A] relative ${inter.variable} font-(family-name:--font-inter)`}
//     >
//       {/* ===== BACKGROUND EFFECTS + WATERMARK ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
//           {/* <div className="relative w-75 h-75 sm:w-100 sm:h-100">
//             <Image
//               src="/images/logo.png"
//               alt="Watermark"
//               fill
//               className="object-contain"
//               unoptimized
//             />
//           </div> */}
//         </div>
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.12)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.08)_0%,transparent_50%)]" />
//       </div>

//       {/* ===== HERO GALLERY ===== */}
//       <div className="relative z-10 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//           {/* Breadcrumb + Badges */}
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <div className="flex items-center gap-2 text-sm text-white/60 min-w-0">
//               <Link
//                 href="/properties"
//                 className="hover:text-white transition-colors text-white/60 shrink-0"
//               >
//                 Properties
//               </Link>
//               <ChevronRight size={14} className="text-white/30 shrink-0" />
//               <span className="text-white/90 font-medium truncate">
//                 {property.title}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
//               {property.isFeatured && (
//                 <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#2B7FFF]/20 text-[#8DC5FF] text-[10px] sm:text-[11px] font-bold rounded-full border border-[#2B7FFF]/30 backdrop-blur-sm">
//                   <Crown size={10} className="fill-[#2B7FFF] text-[#2B7FFF]" />
//                   Featured
//                 </span>
//               )}
//               <span
//                 className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full border backdrop-blur-sm ${
//                   property.status === "available"
//                     ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
//                     : property.status === "sold"
//                       ? "bg-red-500/20 text-red-300 border-red-500/30"
//                       : "bg-blue-500/20 text-blue-300 border-blue-500/30"
//                 }`}
//               >
//                 <ShieldCheck size={10} />
//                 {property.status}
//               </span>
//               <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white/10 text-white/80 text-[10px] sm:text-[11px] font-bold rounded-full border border-white/15 backdrop-blur-sm">
//                 <Tag size={10} />
//                 {property.priceType}
//               </span>
//             </div>
//           </div>

//           {/* Title & Price */}
//           <div className="mb-6 sm:mb-7">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-8 h-px bg-linear-to-r from-[#2B7FFF] to-transparent" />
//               <span className="text-[10px] font-bold text-[#2B7FFF] uppercase tracking-[0.25em]">
//                 Exclusive Listing
//               </span>
//             </div>
//             <h1
//               className={`text-2xl sm:text-3xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-4 ${playfair.variable} font-(family-name:--font-playfair)`}
//             >
//               {property.title}
//             </h1>
//             <div className="flex flex-wrap items-center gap-4 sm:gap-8">
//               <div>
//                 <p
//                   className={`text-2xl sm:text-4xl lg:text-[2.75rem] text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none ${playfair.variable} font-(family-name:--font-playfair)`}
//                 >
//                   {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                   {Number(property.price)?.toLocaleString()}
//                 </p>
//                 {property.priceType === "rent" && (
//                   <p className="text-white/50 text-xs mt-1">per month</p>
//                 )}
//               </div>
//               <div className="h-10 w-px bg-white/15 hidden sm:block" />
//               <div className="flex items-center gap-2 text-white/70 min-w-0">
//                 <MapPin size={15} className="text-[#2B7FFF]/80 shrink-0" />
//                 <span className="text-sm font-medium text-white/90 truncate">
//                   {property.location || property.city}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ===== IMAGE GALLERY ===== */}
//           <div
//             className={`transition-all duration-700 ease-out ${
//               isVisible
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-8"
//             }`}
//           >
//             {hasSingleImage ? (
//               <div className="max-w-4xl mx-auto">
//                 <div className="relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#1b3454] shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-white/15"
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <Image
//                       src={currentDisplayImage}
//                       alt={property.title || "Property"}
//                       fill
//                       loading="eager"
//                       unoptimized
//                       className="object-cover"
//                       sizes="(max-width: 1024px) 100vw, 66vw"
//                       priority
//                     />
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-white/10">
//                       <ImageIcon size={11} className="text-white/80" />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">
//                         1 Photo
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3">
//                 {/* Main Image */}
//                 <div className="md:col-span-9 lg:col-span-8 relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#1b3454] shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-[#2B7FFF]/15"
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <div
//                       key={activeImage}
//                       className="absolute inset-0 transition-opacity duration-300 ease-in-out"
//                     >
//                       <Image
//                         src={currentDisplayImage}
//                         alt={property.title || "Property"}
//                         fill
//                         unoptimized
//                         className="object-cover"
//                         sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 66vw"
//                         priority
//                       />
//                     </div>
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-[#2B7FFF]/20">
//                       <Grid3x3 size={11} className="text-[#2B7FFF]/80" />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">
//                         {activeImage + 1} / {images.length}
//                       </span>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         prevImage();
//                       }}
//                       className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:left-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
//                     >
//                       <ChevronLeft size={18} />
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         nextImage();
//                       }}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:right-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
//                     >
//                       <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Side Thumbnails */}
//                 <div className="md:col-span-3 lg:col-span-4 grid grid-cols-4 md:grid-cols-2 md:grid-rows-2 gap-1.5 sm:gap-2">
//                   {images.slice(0, 4).map((img, index) => {
//                     const safeImg = getSafeImage(img);
//                     if (!safeImg) return null;
//                     const isSeeMore = images.length > 4 && index === 3;
//                     const isActive = activeImage === index;
//                     return (
//                       <button
//                         key={index}
//                         onClick={() => {
//                           if (isSeeMore) {
//                             setActiveImage(3);
//                             setShowLightbox(true);
//                           } else {
//                             setActiveImage(index);
//                           }
//                         }}
//                         className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ring-1 ring-white/15 hover:ring-white/30 aspect-square md:aspect-auto ${
//                           isActive && !isSeeMore
//                             ? "ring-2 ring-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/30"
//                             : "opacity-70 hover:opacity-100"
//                         }`}
//                       >
//                         <Image
//                           src={safeImg}
//                           alt={`Property image ${index + 1}`}
//                           fill
//                           unoptimized
//                           className="object-cover"
//                           sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
//                         />
//                         {isActive && !isSeeMore && (
//                           <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2B7FFF] flex items-center justify-center shadow-lg shadow-[#2B7FFF]/50 z-10 border border-white">
//                             <Check
//                               size={10}
//                               strokeWidth={3}
//                               className="text-white"
//                             />
//                           </div>
//                         )}
//                         {isSeeMore && (
//                           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-0.5 sm:gap-1 z-10">
//                             <Grid3x3 size={14} className="text-white" />
//                             <span className="text-white text-[10px] sm:text-xs font-bold">
//                               +{images.length - 3} More
//                             </span>
//                           </div>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
//           {/* ===== LEFT COLUMN ===== */}
//           <div className="lg:col-span-2 space-y-5 sm:space-y-6">
//             {/* Meta */}
//             {property.propertyCode && (
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "50ms" }}
//               >
//                 <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs text-white/60">
//                   <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#2B7FFF]/15 rounded-full text-[#8DC5FF] font-semibold border border-[#2B7FFF]/25">
//                     <Building2 size={11} />
//                     {property.propertyCode}
//                   </span>
//                   {property.viewsCount > 0 && (
//                     <span className="flex items-center gap-1 text-white/60">
//                       <Eye size={11} /> {property.viewsCount} views
//                     </span>
//                   )}
//                   {property.createdAt && (
//                     <span className="flex items-center gap-1 text-white/60">
//                       <CalendarDays size={11} />
//                       {new Date(property.createdAt).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         },
//                       )}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Quick Stats */}
//             <div
//               className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 transition-all duration-500 ease-out ${
//                 isVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-6"
//               }`}
//               style={{ transitionDelay: "100ms" }}
//             >
//               {property.bedrooms > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Bed size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Beds
//                     </p>
//                     <p
//                       className={`text-lg sm:text-xl font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {property.bedrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.bathrooms > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Bath size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Baths
//                     </p>
//                     <p
//                       className={`text-lg sm:text-xl font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {property.bathrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {(property.areaSize || property.area) > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Ruler size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Area
//                     </p>
//                     <p
//                       className={`text-base sm:text-lg font-bold text-white leading-tight ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {property.areaSize || property.area}
//                       <span className="text-[9px] sm:text-[10px] font-normal text-white/40 ml-0.5">
//                         {property.areaUnit || "sqft"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.propertyType && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Home size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Type
//                     </p>
//                     <p className="text-xs sm:text-sm font-bold text-white leading-tight capitalize truncate">
//                       {property.propertyType}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Description */}
//             {property.description && (
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "150ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/10">
//                   <h3
//                     className={`text-lg sm:text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                   >
//                     Description
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div
//                     className="text-white/70 text-sm sm:text-[15px] leading-[1.9] whitespace-pre-line max-h-72 sm:max-h-80 overflow-y-auto pr-2"
//                     style={{
//                       scrollbarWidth: "thin",
//                       scrollbarColor: "rgba(43,127,255,0.3) transparent",
//                     }}
//                   >
//                     {property.description}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Features */}
//             {(property.features?.length > 0 ||
//               property.amenities?.length > 0) && (
//               <div
//                 className={`hidden md:block transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "200ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-2xl p-5 sm:p-7 border border-white/10">
//                   <h3
//                     className={`text-lg sm:text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                   >
//                     Features & Amenities
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
//                     {[
//                       ...(property.features || []),
//                       ...(property.amenities || []),
//                     ].map((item, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-white/70 bg-white/5 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 border border-white/10 hover:bg-[#2B7FFF]/10 hover:border-[#2B7FFF]/20 transition-colors group"
//                       >
//                         <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/25 transition-colors">
//                           <CheckCircle2
//                             size={10}
//                             className="text-[#2B7FFF]/80"
//                           />
//                         </div>
//                         <span className="capitalize truncate">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Address */}
//             {property.address && (
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "250ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/10">
//                   <h3
//                     className={`text-lg sm:text-xl text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                   >
//                     Address
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div className="flex items-start gap-2.5 sm:gap-3 bg-[rgba(43,127,255,0.1)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[rgba(43,127,255,0.15)]">
//                     <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[rgba(43,127,255,0.15)] flex items-center justify-center shrink-0 mt-0.5">
//                       <MapPin size={13} className="text-[#2B7FFF]/80" />
//                     </div>
//                     <p className="text-white/70 text-xs sm:text-sm leading-relaxed wrap-break-word">
//                       {property.address}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ===== RIGHT SIDEBAR ===== */}
//           <div className="lg:col-span-1">
//             <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
//               {/* Price + CTA Card */}
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "300ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
//                   {/* Price Header */}
//                   <div className="bg-linear-to-r from-[#2B7FFF]/15 via-[#2B7FFF]/8 to-transparent px-4 sm:px-5 lg:px-6 py-4 sm:py-5 border-b border-white/10">
//                     <p className="text-[9px] sm:text-[10px] text-[#2B7FFF]/70 uppercase tracking-[0.2em] font-bold mb-1">
//                       Asking Price
//                     </p>
//                     <p
//                       className={`text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                       {Number(property.price)?.toLocaleString()}
//                     </p>
//                     <p className="text-white/50 text-[11px] sm:text-xs mt-1.5 capitalize tracking-wide">
//                       {property.priceType} &bull; {property.propertyType}
//                     </p>
//                   </div>

//                   {/* Trigger Button + Call/Email — NO LeadForm here */}
//                   <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
//                     {/* Custom trigger button that opens the form OUTSIDE */}
//                     <button
//                       onClick={() => setShowLeadForm(true)}
//                       className="w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 bg-[#2B7FFF] text-white text-sm cursor-pointer font-bold rounded-xl hover:bg-[#4D94FF] active:scale-[0.98] transition-all shadow-lg shadow-[#2B7FFF]/25"
//                     >
//                       <Heart size={16} /> I&apos;m Interested
//                     </button>

//                     <div className="grid grid-cols-2 gap-2">
//                       <a
//                         href={`tel:${property.contact?.phone || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 border border-white/15 text-white/70 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-white/25 transition-colors hover:text-white"
//                       >
//                         <Phone size={12} /> Call
//                       </a>
//                       <a
//                         href={`mailto:${property.contact?.email || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 border border-white/15 text-white/70 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-white/25 transition-colors hover:text-white"
//                       >
//                         <Mail size={12} /> Email
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Agent */}
//               {property.addedBy && (
//                 <div
//                   className={`transition-all duration-500 ease-out ${
//                     isVisible
//                       ? "opacity-100 translate-y-0"
//                       : "opacity-0 translate-y-6"
//                   }`}
//                   style={{ transitionDelay: "350ms" }}
//                 >
//                   <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
//                     <h4 className="text-[8px] sm:text-[9px] font-bold text-white/50 uppercase tracking-[0.25em] mb-2.5 sm:mb-3">
//                       Listed By
//                     </h4>
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#2B7FFF]/20 shadow-lg">
//                         {property.addedBy?.avatar ? (
//                           <img
//                             src={property.addedBy.avatar}
//                             alt=""
//                             className="w-full h-full rounded-full object-cover"
//                           />
//                         ) : (
//                           <User size={18} className="text-[#2B7FFF]/80" />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-xs sm:text-sm font-bold text-white truncate">
//                           {property.addedBy?.name || "Agent"}
//                         </p>
//                         <p className="text-[11px] sm:text-xs text-white/50">
//                           Property Agent
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Details */}
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "400ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
//                   <h4 className="text-[8px] sm:text-[9px] font-bold text-white/50 uppercase tracking-[0.25em] mb-2.5 sm:mb-3">
//                     Property Details
//                   </h4>
//                   <div className="space-y-0">
//                     {property.floors && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60 flex items-center gap-1.5 sm:gap-2">
//                           <Layers size={11} /> Floors
//                         </span>
//                         <span className="font-semibold text-white">
//                           {property.floors}
//                         </span>
//                       </div>
//                     )}
//                     {property.kitchens && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60">Kitchens</span>
//                         <span className="font-semibold text-white">
//                           {property.kitchens}
//                         </span>
//                       </div>
//                     )}
//                     {property.yearBuilt && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60">Year Built</span>
//                         <span className="font-semibold text-white">
//                           {property.yearBuilt}
//                         </span>
//                       </div>
//                     )}
//                     {property.leadsCount > 0 && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
//                         <span className="text-white/60">Interested Buyers</span>
//                         <span className="font-semibold text-[#2B7FFF]">
//                           {property.leadsCount}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Verified */}
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "450ms" }}
//               >
//                 <div className="bg-[rgba(43,127,255,0.1)] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-[rgba(43,127,255,0.2)]">
//                   <div className="flex items-center gap-2.5 sm:gap-3">
//                     <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[rgba(43,127,255,0.2)] flex items-center justify-center shrink-0 border border-[rgba(43,127,255,0.25)]">
//                       <ShieldCheck size={13} className="text-[#2B7FFF]" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-[11px] sm:text-xs font-bold text-[#2B7FFF]">
//                         Verified Listing
//                       </p>
//                       <p className="text-[10px] sm:text-[11px] text-white/50">
//                         Verified by our team
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== LEAD FORM — RENDERED AT ROOT LEVEL, COMPLETELY OUTSIDE THE GRID ===== */}
//       <LeadForm
//         propertyId={property._id}
//         propertyTitle={property.title}
//         propertyCode={property.propertyCode}
//         propertyPrice={property.price}
//         propertyCurrency={property.currency}
//         open={showLeadForm}
//         onOpenChange={setShowLeadForm}
//         trigger={null}
//         onSuccess={(data) => {
//           console.log("Lead created:", data);
//         }}
//       />

//       {/* ===== LIGHTBOX ===== */}
//       {showLightbox && (
//         <div
//           className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
//           onClick={() => setShowLightbox(false)}
//         >
//           <button
//             onClick={() => setShowLightbox(false)}
//             className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 ring-1 ring-white/20"
//           >
//             <X size={18} />
//           </button>
//           <div
//             className="relative w-full h-full flex items-center justify-center px-3 sm:px-16"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               key={activeImage}
//               className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full aspect-video transition-opacity duration-300"
//             >
//               <Image
//                 src={currentDisplayImage}
//                 alt={property.title || "Property"}
//                 fill
//                 unoptimized
//                 className="object-contain"
//                 sizes="100vw"
//               />
//             </div>
//             {!hasSingleImage && (
//               <>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     prevImage();
//                   }}
//                   className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     nextImage();
//                   }}
//                   className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </>
//             )}
//           </div>
//           {!hasSingleImage && (
//             <div
//               className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 overflow-x-auto max-w-[92vw] sm:max-w-[90vw] px-3 sm:px-4"
//               style={{ scrollbarWidth: "none" }}
//             >
//               {images.map((img, index) => {
//                 const safeImg = getSafeImage(img);
//                 if (!safeImg) return null;
//                 return (
//                   <button
//                     key={index}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setActiveImage(index);
//                     }}
//                     className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-md sm:rounded-lg overflow-hidden shrink-0 transition-all duration-300 ring-1 ring-white/20 ${
//                       activeImage === index
//                         ? "ring-2 ring-[#2B7FFF] scale-105"
//                         : "opacity-50 hover:opacity-80"
//                     }`}
//                   >
//                     <Image
//                       src={safeImg}
//                       alt=""
//                       fill
//                       unoptimized
//                       className="object-cover"
//                       sizes="64px"
//                     />
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//           <div className="absolute top-3 left-3 sm:top-5 sm:left-5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full ring-1 ring-white/20">
//             <span className="text-white text-[11px] sm:text-sm font-semibold">
//               {activeImage + 1} / {images.length}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   MapPin,
//   Bed,
//   Bath,
//   ArrowLeft,
//   Phone,
//   Mail,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Building2,
//   Home,
//   CalendarDays,
//   Eye,
//   Check,
//   CheckCircle2,
//   Layers,
//   ZoomIn,
//   Ruler,
//   Tag,
//   ShieldCheck,
//   Grid3x3,
//   Image as ImageIcon,
//   Crown,
//   Gem,
//   Heart,
// } from "lucide-react";
// import { getPropertyById } from "@/lib/api";
// import LeadForm from "@/components/forms/LeadForm";

// // ============================================
// // SAFE IMAGE HELPER
// // ============================================
// const getSafeImage = (img) => {
//   if (!img) return null;
//   if (typeof img === "string") return img.trim();
//   if (typeof img === "object" && img?.url) return img.url.trim();
//   return null;
// };

// const PLACEHOLDER_IMG =
//   "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeImage, setActiveImage] = useState(0);
//   const [showLightbox, setShowLightbox] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [showLeadForm, setShowLeadForm] = useState(false);

//   const heroRef = useRef(null);

//   // ============================================
//   // FETCH
//   // ============================================
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         const res = await getPropertyById(id);
//         setProperty(res?.data || res);
//       } catch (err) {
//         setError("Property not found or removed");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProperty();
//   }, [id]);

//   // ============================================
//   // TRIGGER CSS ANIMATIONS ON MOUNT
//   // ============================================
//   useEffect(() => {
//     if (!property || loading) return;
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 80);
//     return () => clearTimeout(timer);
//   }, [property, loading]);

//   // ============================================
//   // SAFE IMAGES
//   // ============================================
//   const rawImages = property?.images || [];
//   const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
//   const mainImage =
//     getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

//   // ============================================
//   // IMAGE NAVIGATION
//   // ============================================
//   const nextImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev + 1) % images.length);
//   };
//   const prevImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!showLightbox) return;
//       if (e.key === "ArrowRight") nextImage();
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "Escape") setShowLightbox(false);
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showLightbox, images.length]);

//   // ============================================
//   // SHARE
//   // ============================================
//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: property?.title,
//         text: `Check out ${property?.title} at ${property?.location}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied!");
//     }
//   };

//   // ============================================
//   // LOADING
//   // ============================================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#39518A] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-5">
//           <div className="relative">
//             <div className="w-14 h-14 border-2 border-[#2B7FFF]/20 border-t-[#2B7FFF] rounded-full animate-spin" />
//             <Gem
//               size={16}
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2B7FFF]/60"
//             />
//           </div>
//           <p className="text-white/40 text-sm tracking-[0.2em] uppercase">
//             Loading property...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR
//   // ============================================
//   if (error || !property) {
//     return (
//       <div className="min-h-screen bg-[#39518A] flex flex-col items-center justify-center gap-4 px-4">
//         <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
//           <X size={32} className="text-white/40" />
//         </div>
//         <h2 className="text-xl font-bold text-white">
//           Property Not Found
//         </h2>
//         <p className="text-white/50 text-sm text-center max-w-sm">{error}</p>
//         <Link
//           href="/properties"
//           className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF]/10 backdrop-blur-md border border-[#2B7FFF]/20 text-[#2B7FFF] text-sm font-semibold rounded-xl hover:bg-[#2B7FFF]/20 transition-colors"
//         >
//           <ArrowLeft size={16} /> Browse Properties
//         </Link>
//       </div>
//     );
//   }

//   const currentDisplayImage =
//     images.length > 0 ? images[activeImage] || mainImage : mainImage;
//   const hasSingleImage = images.length <= 1;

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <div className="min-h-screen bg-[#39518A] relative">
//       {/* ===== BACKGROUND EFFECTS + WATERMARK ===== */}
//       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.12)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.08)_0%,transparent_50%)]" />
//       </div>

//       {/* ===== HERO GALLERY ===== */}
//       <div className="relative z-10 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//           {/* Breadcrumb + Badges */}
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <div className="flex items-center gap-2 text-sm text-white/60 min-w-0">
//               <Link
//                 href="/properties"
//                 className="hover:text-white transition-colors text-white/60 shrink-0"
//               >
//                 Properties
//               </Link>
//               <ChevronRight size={14} className="text-white/30 shrink-0" />
//               <span className="text-white/90 font-medium truncate">
//                 {property.title}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
//               {property.isFeatured && (
//                 <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#2B7FFF]/20 text-[#8DC5FF] text-[10px] sm:text-[11px] font-bold rounded-full border border-[#2B7FFF]/30 backdrop-blur-sm">
//                   <Crown size={10} className="fill-[#2B7FFF] text-[#2B7FFF]" />
//                   Featured
//                 </span>
//               )}
//               <span
//                 className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full border backdrop-blur-sm ${
//                   property.status === "available"
//                     ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
//                     : property.status === "sold"
//                       ? "bg-red-500/20 text-red-300 border-red-500/30"
//                       : "bg-blue-500/20 text-blue-300 border-blue-500/30"
//                 }`}
//               >
//                 <ShieldCheck size={10} />
//                 {property.status}
//               </span>
//               <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white/10 text-white/80 text-[10px] sm:text-[11px] font-bold rounded-full border border-white/15 backdrop-blur-sm">
//                 <Tag size={10} />
//                 {property.priceType}
//               </span>
//             </div>
//           </div>

//           {/* Title & Price */}
//           <div className="mb-6 sm:mb-7">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-8 h-px bg-linear-to-r from-[#2B7FFF] to-transparent" />
//               <span className="text-[10px] font-bold text-[#2B7FFF] uppercase tracking-[0.25em]">
//                 Exclusive Listing
//               </span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-4">
//               {property.title}
//             </h1>
//             <div className="flex flex-wrap items-center gap-4 sm:gap-8">
//               <div>
//                 <p className="text-2xl sm:text-4xl lg:text-[2.75rem] text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none">
//                   {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                   {Number(property.price)?.toLocaleString()}
//                 </p>
//                 {property.priceType === "rent" && (
//                   <p className="text-white/50 text-xs mt-1">per month</p>
//                 )}
//               </div>
//               <div className="h-10 w-px bg-white/15 hidden sm:block" />
//               <div className="flex items-center gap-2 text-white/70 min-w-0">
//                 <MapPin size={15} className="text-[#2B7FFF]/80 shrink-0" />
//                 <span className="text-sm font-medium text-white/90 truncate">
//                   {property.location || property.city}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ===== IMAGE GALLERY ===== */}
//           <div
//             className={`transition-all duration-700 ease-out ${
//               isVisible
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-8"
//             }`}
//           >
//             {hasSingleImage ? (
//               <div className="max-w-4xl mx-auto">
//                 <div className="relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#1b3454] shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-white/15"
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <Image
//                       src={currentDisplayImage}
//                       alt={property.title || "Property"}
//                       fill
//                       loading="eager"
//                       unoptimized
//                       className="object-cover"
//                       sizes="(max-width: 1024px) 100vw, 66vw"
//                       priority
//                     />
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-white/10">
//                       <ImageIcon size={11} className="text-white/80" />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">
//                         1 Photo
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3">
//                 {/* Main Image */}
//                 <div className="lg:col-span-8 relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#1b3454] shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-[#2B7FFF]/15"
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <div
//                       key={activeImage}
//                       className="absolute inset-0 transition-opacity duration-300 ease-in-out"
//                     >
//                       <Image
//                         src={currentDisplayImage}
//                         alt={property.title || "Property"}
//                         fill
//                         unoptimized
//                         className="object-cover"
//                         sizes="(max-width: 1024px) 100vw, 66vw"
//                         priority
//                       />
//                     </div>
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/40 backdrop-blur-md rounded-full flex items-center gap-1.5 ring-1 ring-[#2B7FFF]/20">
//                       <Grid3x3 size={11} className="text-[#2B7FFF]/80" />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">
//                         {activeImage + 1} / {images.length}
//                       </span>
//                     </div>
//                     {/* Nav arrows - hidden on mobile, shown on sm+ */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         prevImage();
//                       }}
//                       className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:left-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
//                     >
//                       <ChevronLeft size={18} />
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         nextImage();
//                       }}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:right-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
//                     >
//                       <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Side Thumbnails - only side-by-side on lg+, horizontal row below on smaller screens */}
//                 <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-1.5 sm:gap-2">
//                   {images.slice(0, 4).map((img, index) => {
//                     const safeImg = getSafeImage(img);
//                     if (!safeImg) return null;
//                     const isSeeMore = images.length > 4 && index === 3;
//                     const isActive = activeImage === index;
//                     return (
//                       <button
//                         key={index}
//                         onClick={() => {
//                           if (isSeeMore) {
//                             setActiveImage(3);
//                             setShowLightbox(true);
//                           } else {
//                             setActiveImage(index);
//                           }
//                         }}
//                         className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ring-1 ring-white/15 hover:ring-white/30 aspect-square ${
//                           isActive && !isSeeMore
//                             ? "ring-2 ring-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/30"
//                             : "opacity-70 hover:opacity-100"
//                         }`}
//                       >
//                         <Image
//                           src={safeImg}
//                           alt={`Property image ${index + 1}`}
//                           fill
//                           unoptimized
//                           className="object-cover"
//                           sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
//                         />
//                         {isActive && !isSeeMore && (
//                           <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2B7FFF] flex items-center justify-center shadow-lg shadow-[#2B7FFF]/50 z-10 border border-white">
//                             <Check
//                               size={10}
//                               strokeWidth={3}
//                               className="text-white"
//                             />
//                           </div>
//                         )}
//                         {isSeeMore && (
//                           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center flex-col gap-0.5 sm:gap-1 z-10">
//                             <Grid3x3 size={14} className="text-white" />
//                             <span className="text-white text-[10px] sm:text-xs font-bold">
//                               +{images.length - 3} More
//                             </span>
//                           </div>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
//           {/* ===== LEFT COLUMN ===== */}
//           <div className="lg:col-span-2 space-y-5 sm:space-y-6">
//             {/* Meta */}
//             {property.propertyCode && (
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "50ms" }}
//               >
//                 <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs text-white/60">
//                   <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#2B7FFF]/15 rounded-full text-[#8DC5FF] font-semibold border border-[#2B7FFF]/25">
//                     <Building2 size={11} />
//                     {property.propertyCode}
//                   </span>
//                   {property.viewsCount > 0 && (
//                     <span className="flex items-center gap-1 text-white/60">
//                       <Eye size={11} /> {property.viewsCount} views
//                     </span>
//                   )}
//                   {property.createdAt && (
//                     <span className="flex items-center gap-1 text-white/60">
//                       <CalendarDays size={11} />
//                       {new Date(property.createdAt).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         }
//                       )}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Quick Stats */}
//             <div
//               className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 transition-all duration-500 ease-out ${
//                 isVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-6"
//               }`}
//               style={{ transitionDelay: "100ms" }}
//             >
//               {property.bedrooms > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Bed size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Beds
//                     </p>
//                     <p className="text-lg sm:text-xl font-bold text-white leading-tight">
//                       {property.bedrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.bathrooms > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Bath size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Baths
//                     </p>
//                     <p className="text-lg sm:text-xl font-bold text-white leading-tight">
//                       {property.bathrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {(property.areaSize || property.area) > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Ruler size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Area
//                     </p>
//                     <p className="text-base sm:text-lg font-bold text-white leading-tight">
//                       {property.areaSize || property.area}
//                       <span className="text-[9px] sm:text-[10px] font-normal text-white/40 ml-0.5">
//                         {property.areaUnit || "sqft"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.propertyType && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Home size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Type
//                     </p>
//                     <p className="text-xs sm:text-sm font-bold text-white leading-tight capitalize truncate">
//                       {property.propertyType}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Description */}
//             {property.description && (
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "150ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/10">
//                   <h3 className="text-lg sm:text-xl text-white mb-1">
//                     Description
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div
//                     className="text-white/70 text-sm sm:text-[15px] leading-[1.9] whitespace-pre-line max-h-72 sm:max-h-80 overflow-y-auto pr-2"
//                     style={{
//                       scrollbarWidth: "thin",
//                       scrollbarColor: "rgba(43,127,255,0.3) transparent",
//                     }}
//                   >
//                     {property.description}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Features - visible on all screens now */}
//             {(property.features?.length > 0 ||
//               property.amenities?.length > 0) && (
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "200ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-2xl p-5 sm:p-7 border border-white/10">
//                   <h3 className="text-lg sm:text-xl text-white mb-1">
//                     Features & Amenities
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
//                     {[
//                       ...(property.features || []),
//                       ...(property.amenities || []),
//                     ].map((item, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-white/70 bg-white/5 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 border border-white/10 hover:bg-[#2B7FFF]/10 hover:border-[#2B7FFF]/20 transition-colors group"
//                       >
//                         <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/25 transition-colors">
//                           <CheckCircle2
//                             size={10}
//                             className="text-[#2B7FFF]/80"
//                           />
//                         </div>
//                         <span className="capitalize truncate">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Address */}
//             {property.address && (
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "250ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/10">
//                   <h3 className="text-lg sm:text-xl text-white mb-1">
//                     Address
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div className="flex items-start gap-2.5 sm:gap-3 bg-[rgba(43,127,255,0.1)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[rgba(43,127,255,0.15)]">
//                     <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[rgba(43,127,255,0.15)] flex items-center justify-center shrink-0 mt-0.5">
//                       <MapPin size={13} className="text-[#2B7FFF]/80" />
//                     </div>
//                     <p className="text-white/70 text-xs sm:text-sm leading-relaxed wrap-break-word">
//                       {property.address}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ===== RIGHT SIDEBAR ===== */}
//           <div className="lg:col-span-1">
//             <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
//               {/* Price + CTA Card */}
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "300ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
//                   {/* Price Header */}
//                   <div className="bg-linear-to-r from-[#2B7FFF]/15 via-[#2B7FFF]/8 to-transparent px-4 sm:px-5 lg:px-6 py-4 sm:py-5 border-b border-white/10">
//                     <p className="text-[9px] sm:text-[10px] text-[#2B7FFF]/70 uppercase tracking-[0.2em] font-bold mb-1">
//                       Asking Price
//                     </p>
//                     <p className="text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none">
//                       {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                       {Number(property.price)?.toLocaleString()}
//                     </p>
//                     <p className="text-white/50 text-[11px] sm:text-xs mt-1.5 capitalize tracking-wide">
//                       {property.priceType} &bull; {property.propertyType}
//                     </p>
//                   </div>

//                   {/* Trigger Button + Call/Email */}
//                   <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
//                     <button
//                       onClick={() => setShowLeadForm(true)}
//                       className="w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 bg-[#2B7FFF] text-white text-sm cursor-pointer font-bold rounded-xl hover:bg-[#4D94FF] active:scale-[0.98] transition-all shadow-lg shadow-[#2B7FFF]/25"
//                     >
//                       <Heart size={16} /> I&apos;m Interested
//                     </button>

//                     <div className="grid grid-cols-2 gap-2">
//                       <a
//                         href={`tel:${property.contact?.phone || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 border border-white/15 text-white/70 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-white/25 transition-colors hover:text-white"
//                       >
//                         <Phone size={12} /> Call
//                       </a>
//                       <a
//                         href={`mailto:${property.contact?.email || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 border border-white/15 text-white/70 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-white/25 transition-colors hover:text-white"
//                       >
//                         <Mail size={12} /> Email
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Agent */}
//               {property.addedBy && (
//                 <div
//                   className={`transition-all duration-500 ease-out ${
//                     isVisible
//                       ? "opacity-100 translate-y-0"
//                       : "opacity-0 translate-y-6"
//                   }`}
//                   style={{ transitionDelay: "350ms" }}
//                 >
//                   <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
//                     <h4 className="text-[8px] sm:text-[9px] font-bold text-white/50 uppercase tracking-[0.25em] mb-2.5 sm:mb-3">
//                       Listed By
//                     </h4>
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#2B7FFF]/20 shadow-lg">
//                         {property.addedBy?.avatar ? (
//                           <img
//                             src={property.addedBy.avatar}
//                             alt=""
//                             className="w-full h-full rounded-full object-cover"
//                           />
//                         ) : (
//                           <User size={18} className="text-[#2B7FFF]/80" />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-xs sm:text-sm font-bold text-white truncate">
//                           {property.addedBy?.name || "Agent"}
//                         </p>
//                         <p className="text-[11px] sm:text-xs text-white/50">
//                           Property Agent
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Details */}
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "400ms" }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
//                   <h4 className="text-[8px] sm:text-[9px] font-bold text-white/50 uppercase tracking-[0.25em] mb-2.5 sm:mb-3">
//                     Property Details
//                   </h4>
//                   <div className="space-y-0">
//                     {property.floors && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60 flex items-center gap-1.5 sm:gap-2">
//                           <Layers size={11} /> Floors
//                         </span>
//                         <span className="font-semibold text-white">
//                           {property.floors}
//                         </span>
//                       </div>
//                     )}
//                     {property.kitchens && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60">Kitchens</span>
//                         <span className="font-semibold text-white">
//                           {property.kitchens}
//                         </span>
//                       </div>
//                     )}
//                     {property.yearBuilt && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60">Year Built</span>
//                         <span className="font-semibold text-white">
//                           {property.yearBuilt}
//                         </span>
//                       </div>
//                     )}
//                     {property.leadsCount > 0 && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
//                         <span className="text-white/60">Interested Buyers</span>
//                         <span className="font-semibold text-[#2B7FFF]">
//                           {property.leadsCount}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Verified */}
//               <div
//                 className={`transition-all duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{ transitionDelay: "450ms" }}
//               >
//                 <div className="bg-[rgba(43,127,255,0.1)] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-[rgba(43,127,255,0.2)]">
//                   <div className="flex items-center gap-2.5 sm:gap-3">
//                     <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[rgba(43,127,255,0.2)] flex items-center justify-center shrink-0 border border-[rgba(43,127,255,0.25)]">
//                       <ShieldCheck size={13} className="text-[#2B7FFF]" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-[11px] sm:text-xs font-bold text-[#2B7FFF]">
//                         Verified Listing
//                       </p>
//                       <p className="text-[10px] sm:text-[11px] text-white/50">
//                         Verified by our team
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== LEAD FORM ===== */}
//       <LeadForm
//         propertyId={property._id}
//         propertyTitle={property.title}
//         propertyCode={property.propertyCode}
//         propertyPrice={property.price}
//         propertyCurrency={property.currency}
//         open={showLeadForm}
//         onOpenChange={setShowLeadForm}
//         trigger={null}
//         onSuccess={(data) => {
//           console.log("Lead created:", data);
//         }}
//       />

//       {/* ===== LIGHTBOX ===== */}
//       {showLightbox && (
//         <div
//           className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
//           onClick={() => setShowLightbox(false)}
//         >
//           <button
//             onClick={() => setShowLightbox(false)}
//             className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 ring-1 ring-white/20"
//           >
//             <X size={18} />
//           </button>
//           <div
//             className="relative w-full h-full flex items-center justify-center px-3 sm:px-16"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               key={activeImage}
//               className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full aspect-video transition-opacity duration-300"
//             >
//               <Image
//                 src={currentDisplayImage}
//                 alt={property.title || "Property"}
//                 fill
//                 unoptimized
//                 className="object-contain"
//                 sizes="100vw"
//               />
//             </div>
//             {!hasSingleImage && (
//               <>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     prevImage();
//                   }}
//                   className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     nextImage();
//                   }}
//                   className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </>
//             )}
//           </div>
//           {!hasSingleImage && (
//             <div
//               className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 overflow-x-auto max-w-[92vw] sm:max-w-[90vw] px-3 sm:px-4"
//               style={{ scrollbarWidth: "none" }}
//             >
//               {images.map((img, index) => {
//                 const safeImg = getSafeImage(img);
//                 if (!safeImg) return null;
//                 return (
//                   <button
//                     key={index}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setActiveImage(index);
//                     }}
//                     className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-md sm:rounded-lg overflow-hidden shrink-0 transition-all duration-300 ring-1 ring-white/20 ${
//                       activeImage === index
//                         ? "ring-2 ring-[#2B7FFF] scale-105"
//                         : "opacity-50 hover:opacity-80"
//                     }`}
//                   >
//                     <Image
//                       src={safeImg}
//                       alt=""
//                       fill
//                       unoptimized
//                       className="object-cover"
//                       sizes="64px"
//                     />
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//           <div className="absolute top-3 left-3 sm:top-5 sm:left-5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full ring-1 ring-white/20">
//             <span className="text-white text-[11px] sm:text-sm font-semibold">
//               {activeImage + 1} / {images.length}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   MapPin,
//   Bed,
//   Bath,
//   ArrowLeft,
//   Phone,
//   Mail,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Building2,
//   Home,
//   CalendarDays,
//   Eye,
//   Check,
//   CheckCircle2,
//   Layers,
//   ZoomIn,
//   Ruler,
//   Tag,
//   ShieldCheck,
//   Grid3x3,
//   Image as ImageIcon,
//   Crown,
//   Gem,
//   Heart,
// } from "lucide-react";
// import { getPropertyById } from "@/lib/api";
// import LeadForm from "@/components/forms/LeadForm";

// // ============================================
// // SAFE IMAGE HELPER
// // ============================================
// const getSafeImage = (img) => {
//   if (!img) return null;
//   if (typeof img === "string") return img.trim();
//   if (typeof img === "object" && img?.url) return img.url.trim();
//   return null;
// };

// const PLACEHOLDER_IMG =
//   "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeImage, setActiveImage] = useState(0);
//   const [showLightbox, setShowLightbox] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [showLeadForm, setShowLeadForm] = useState(false);

//   const heroRef = useRef(null);

//   // ============================================
//   // FETCH
//   // ============================================
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         const res = await getPropertyById(id);
//         setProperty(res?.data || res);
//       } catch (err) {
//         setError("Property not found or removed");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProperty();
//   }, [id]);

//   // ============================================
//   // TRIGGER CSS ANIMATIONS ON MOUNT
//   // ============================================
//   useEffect(() => {
//     if (!property || loading) return;
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 80);
//     return () => clearTimeout(timer);
//   }, [property, loading]);

//   // ============================================
//   // SAFE IMAGES
//   // ============================================
//   const rawImages = property?.images || [];
//   const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
//   const mainImage =
//     getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

//   // ============================================
//   // IMAGE NAVIGATION
//   // ============================================
//   const nextImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev + 1) % images.length);
//   };
//   const prevImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!showLightbox) return;
//       if (e.key === "ArrowRight") nextImage();
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "Escape") setShowLightbox(false);
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showLightbox, images.length]);

//   // ============================================
//   // SHARE
//   // ============================================
//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: property?.title,
//         text: `Check out ${property?.title} at ${property?.location}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied!");
//     }
//   };

//   // ============================================
//   // LOADING
//   // ============================================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#39518A] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-5">
//           <div className="relative">
//             <div className="w-14 h-14 border-2 border-[#2B7FFF]/20 border-t-[#2B7FFF] rounded-full animate-spin" />
//             <Gem
//               size={16}
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2B7FFF]/60"
//             />
//           </div>
//           <p className="text-white/40 text-sm tracking-[0.2em] uppercase">
//             Loading property...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR
//   // ============================================
//   if (error || !property) {
//     return (
//       <div className="min-h-screen bg-[#39518A] flex flex-col items-center justify-center gap-4 px-4">
//         <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
//           <X size={32} className="text-white/40" />
//         </div>
//         <h2 className="text-xl font-bold text-white">Property Not Found</h2>
//         <p className="text-white/50 text-sm text-center max-w-sm">{error}</p>
//         <Link
//           href="/properties"
//           className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#2B7FFF]/10 backdrop-blur-md border border-[#2B7FFF]/20 text-[#2B7FFF] text-sm font-semibold rounded-xl hover:bg-[#2B7FFF]/20 transition-colors"
//         >
//           <ArrowLeft size={16} /> Browse Properties
//         </Link>
//       </div>
//     );
//   }

//   const currentDisplayImage =
//     images.length > 0 ? images[activeImage] || mainImage : mainImage;
//   const hasSingleImage = images.length <= 1;

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <div className="min-h-screen bg-[#39518A] relative">
//       {/*
//         ===== BACKGROUND EFFECTS + WATERMARK =====
//         FIX: changed from `fixed` -> `absolute`.
//         `fixed` forces the browser to recomposite this whole layer (plus every
//         backdrop-blur element sitting above it) on every single scroll frame,
//         which is what caused the tearing/glitch on mobile. `absolute` scrolls
//         normally with the page and only needs to be painted once.
//       */}
//       <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.12)_0%,transparent_40%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.08)_0%,transparent_50%)]" />
//       </div>

//       {/* ===== HERO GALLERY ===== */}
//       <div className="relative z-10 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//           {/* Breadcrumb + Badges */}
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <div className="flex items-center gap-2 text-sm text-white/60 min-w-0">
//               <Link
//                 href="/properties"
//                 className="hover:text-white transition-colors text-white/60 shrink-0"
//               >
//                 Properties
//               </Link>
//               <ChevronRight size={14} className="text-white/30 shrink-0" />
//               <span className="text-white/90 font-medium truncate">
//                 {property.title}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
//               {property.isFeatured && (
//                 <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#2B7FFF]/20 text-[#8DC5FF] text-[10px] sm:text-[11px] font-bold rounded-full border border-[#2B7FFF]/30 backdrop-blur-sm">
//                   <Crown size={10} className="fill-[#2B7FFF] text-[#2B7FFF]" />
//                   Featured
//                 </span>
//               )}
//               <span
//                 className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full border backdrop-blur-sm ${property.status === "available" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : property.status === "sold" ? "bg-red-500/20 text-red-300 border-red-500/30" : property.status === "rented" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : property.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : property.status === "reserved" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : property.status === "under construction" ? "bg-sky-500/20 text-sky-300 border-sky-500/30" : property.status === "off plan" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : property.status === "new" ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"}`}
//               >
//                 <ShieldCheck size={10} />
//                 {property.status}
//               </span>
//               <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-white/10 text-white/80 text-[10px] sm:text-[11px] font-bold rounded-full border border-white/15 backdrop-blur-sm">
//                 <Tag size={10} />
//                 {property.priceType}
//               </span>
//             </div>
//           </div>

//           {/* Title & Price */}
//           <div className="mb-6 sm:mb-7">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-8 h-px bg-linear-to-r from-[#2B7FFF] to-transparent" />
//               <span className="text-[10px] font-bold text-[#2B7FFF] uppercase tracking-[0.25em]">
//                 Exclusive Listing
//               </span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-4">
//               {property.title}
//             </h1>
//             <div className="flex flex-wrap items-center gap-4 sm:gap-8">
//               <div>
//                 <p className="text-2xl sm:text-4xl lg:text-[2.75rem] text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none">
//                   {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                   {Number(property.price)?.toLocaleString()}
//                 </p>
//                 {property.priceType === "rent" && (
//                   <p className="text-white/50 text-xs mt-1">per month</p>
//                 )}
//               </div>
//               <div className="h-10 w-px bg-white/15 hidden sm:block" />
//               <div className="flex items-center gap-2 text-white/70 min-w-0">
//                 <MapPin size={15} className="text-[#2B7FFF]/80 shrink-0" />
//                 <span className="text-sm font-medium text-white/90 truncate">
//                   {property.location || property.city}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/*
//             ===== IMAGE GALLERY =====
//             FIX: transition-all -> transition-opacity + explicit transform.
//             transition-all forces the browser to watch/animate every CSS
//             property (including ones that don't need to change), which adds
//             extra paint work right when the gallery images are also loading.
//           */}
//           <div
//             className={`transition-opacity duration-700 ease-out ${
//               isVisible
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-8"
//             }`}
//             style={{ transitionProperty: "opacity, transform" }}
//           >
//             {hasSingleImage ? (
//               <div className="max-w-4xl mx-auto">
//                 <div className="relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#1b3454] shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-white/15"
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <Image
//                       src={currentDisplayImage}
//                       alt={property.title || "Property"}
//                       fill
//                       loading="eager"
//                       unoptimized
//                       className="object-cover"
//                       sizes="(max-width: 1024px) 100vw, 66vw"
//                       priority
//                     />
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     {/* FIX: backdrop-blur-md -> solid bg (lighter for mobile GPU) */}
//                     <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20 transform-[translateZ(0)]">
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 ring-white/10 transform-[translateZ(0)]">
//                       <ImageIcon size={11} className="text-white/80" />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">
//                         1 Photo
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3">
//                 {/* Main Image */}
//                 <div className="lg:col-span-8 relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#1b3454] shadow-2xl shadow-black/50 cursor-zoom-in ring-1 ring-[#2B7FFF]/15"
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <div
//                       key={activeImage}
//                       className="absolute inset-0 transition-opacity duration-300 ease-in-out"
//                     >
//                       <Image
//                         src={currentDisplayImage}
//                         alt={property.title || "Property"}
//                         fill
//                         unoptimized
//                         className="object-cover"
//                         sizes="(max-width: 1024px) 100vw, 66vw"
//                         priority
//                       />
//                     </div>
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     {/* FIX: backdrop-blur-md -> solid bg */}
//                     <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20 transform-[translateZ(0)]">
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 ring-[#2B7FFF]/20 transform-[translateZ(0)]">
//                       <Grid3x3 size={11} className="text-[#2B7FFF]/80" />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">
//                         {activeImage + 1} / {images.length}
//                       </span>
//                     </div>
//                     {/* Nav arrows - FIX: backdrop-blur-md -> solid bg */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         prevImage();
//                       }}
//                       className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:left-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20 transform-[translateZ(0)]"
//                     >
//                       <ChevronLeft size={18} />
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         nextImage();
//                       }}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:right-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20 transform-[translateZ(0)]"
//                     >
//                       <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Side Thumbnails */}
//                 <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-1.5 sm:gap-2">
//                   {images.slice(0, 4).map((img, index) => {
//                     const safeImg = getSafeImage(img);
//                     if (!safeImg) return null;
//                     const isSeeMore = images.length > 4 && index === 3;
//                     const isActive = activeImage === index;
//                     return (
//                       <button
//                         key={index}
//                         onClick={() => {
//                           if (isSeeMore) {
//                             setActiveImage(3);
//                             setShowLightbox(true);
//                           } else {
//                             setActiveImage(index);
//                           }
//                         }}
//                         className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ring-1 ring-white/15 hover:ring-white/30 aspect-square ${
//                           isActive && !isSeeMore
//                             ? "ring-2 ring-[#2B7FFF] shadow-lg shadow-[#2B7FFF]/30"
//                             : "opacity-70 hover:opacity-100"
//                         }`}
//                       >
//                         <Image
//                           src={safeImg}
//                           alt={`Property image ${index + 1}`}
//                           fill
//                           unoptimized
//                           className="object-cover"
//                           sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
//                         />
//                         {isActive && !isSeeMore && (
//                           <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2B7FFF] flex items-center justify-center shadow-lg shadow-[#2B7FFF]/50 z-10 border border-white">
//                             <Check
//                               size={10}
//                               strokeWidth={3}
//                               className="text-white"
//                             />
//                           </div>
//                         )}
//                         {isSeeMore && (
//                           /* FIX: backdrop-blur-sm -> solid bg */
//                           <div className="absolute inset-0 bg-black/75 flex items-center justify-center flex-col gap-0.5 sm:gap-1 z-10 transform-[translateZ(0)]">
//                             <Grid3x3 size={14} className="text-white" />
//                             <span className="text-white text-[10px] sm:text-xs font-bold">
//                               +{images.length - 3} More
//                             </span>
//                           </div>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
//           {/* ===== LEFT COLUMN ===== */}
//           <div className="lg:col-span-2 space-y-5 sm:space-y-6">
//             {/* Meta */}
//             {property.propertyCode && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{
//                   transitionDelay: "50ms",
//                   transitionProperty: "opacity, transform",
//                 }}
//               >
//                 <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs text-white/60">
//                   <span className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#2B7FFF]/15 rounded-full text-[#8DC5FF] font-semibold border border-[#2B7FFF]/25">
//                     <Building2 size={11} />
//                     {property.propertyCode}
//                   </span>
//                   {property.viewsCount > 0 && (
//                     <span className="flex items-center gap-1 text-white/60">
//                       <Eye size={11} /> {property.viewsCount} views
//                     </span>
//                   )}
//                   {property.createdAt && (
//                     <span className="flex items-center gap-1 text-white/60">
//                       <CalendarDays size={11} />
//                       {new Date(property.createdAt).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         },
//                       )}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Quick Stats */}
//             <div
//               className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 transition-opacity duration-500 ease-out ${
//                 isVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-6"
//               }`}
//               style={{
//                 transitionDelay: "100ms",
//                 transitionProperty: "opacity, transform",
//               }}
//             >
//               {property.bedrooms > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Bed size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Beds
//                     </p>
//                     <p className="text-lg sm:text-xl font-bold text-white leading-tight">
//                       {property.bedrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.bathrooms > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Bath size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Baths
//                     </p>
//                     <p className="text-lg sm:text-xl font-bold text-white leading-tight">
//                       {property.bathrooms}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {(property.areaSize || property.area) > 0 && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Ruler size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Area
//                     </p>
//                     <p className="text-base sm:text-lg font-bold text-white leading-tight">
//                       {property.areaSize || property.area}
//                       <span className="text-[9px] sm:text-[10px] font-normal text-white/40 ml-0.5">
//                         {property.areaUnit || "sqft"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.propertyType && (
//                 <div className="flex items-center gap-2.5 sm:gap-3 bg-[#1b3454] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-[#2B7FFF]/30 transition-all group">
//                   <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#2B7FFF]/15 group-hover:bg-[#2B7FFF]/25 flex items-center justify-center shrink-0 transition-colors border border-[#2B7FFF]/15">
//                     <Home size={16} className="text-[#2B7FFF]/80" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] text-white/50 uppercase tracking-[0.2em] font-bold">
//                       Type
//                     </p>
//                     <p className="text-xs sm:text-sm font-bold text-white leading-tight capitalize truncate">
//                       {property.propertyType}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Description */}
//             {property.description && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{
//                   transitionDelay: "150ms",
//                   transitionProperty: "opacity, transform",
//                 }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/10">
//                   <h3 className="text-lg sm:text-xl text-white mb-1">
//                     Description
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div
//                     className="text-white/70 text-sm sm:text-[15px] leading-[1.9] whitespace-pre-line max-h-72 sm:max-h-80 overflow-y-auto pr-2"
//                     style={{
//                       scrollbarWidth: "thin",
//                       scrollbarColor: "rgba(43,127,255,0.3) transparent",
//                     }}
//                   >
//                     {property.description}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Features */}
//             {(property.features?.length > 0 ||
//               property.amenities?.length > 0) && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{
//                   transitionDelay: "200ms",
//                   transitionProperty: "opacity, transform",
//                 }}
//               >
//                 <div className="bg-[#1b3454] md:block hidden rounded-2xl p-5 sm:p-7 border border-white/10">
//                   <h3 className="text-lg sm:text-xl text-white mb-1">
//                     Features & Amenities
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
//                     {[
//                       ...(property.features || []),
//                       ...(property.amenities || []),
//                     ].map((item, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-white/70 bg-white/5 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 border border-white/10 hover:bg-[#2B7FFF]/10 hover:border-[#2B7FFF]/20 transition-colors group"
//                       >
//                         <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 group-hover:bg-[#2B7FFF]/25 transition-colors">
//                           <CheckCircle2
//                             size={10}
//                             className="text-[#2B7FFF]/80"
//                           />
//                         </div>
//                         <span className="capitalize truncate">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Address */}
//             {property.address && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{
//                   transitionDelay: "250ms",
//                   transitionProperty: "opacity, transform",
//                 }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 border border-white/10">
//                   <h3 className="text-lg sm:text-xl text-white mb-1">
//                     Address
//                   </h3>
//                   <div className="w-12 h-0.5 bg-linear-to-r from-[#2B7FFF] to-transparent rounded-full mb-4 sm:mb-5" />
//                   <div className="flex items-start gap-2.5 sm:gap-3 bg-[rgba(43,127,255,0.1)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[rgba(43,127,255,0.15)]">
//                     <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[rgba(43,127,255,0.15)] flex items-center justify-center shrink-0 mt-0.5">
//                       <MapPin size={13} className="text-[#2B7FFF]/80" />
//                     </div>
//                     <p className="text-white/70 text-xs sm:text-sm leading-relaxed wrap-break-word">
//                       {property.address}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ===== RIGHT SIDEBAR ===== */}
//           <div className="lg:col-span-1">
//             <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
//               {/* Price + CTA Card */}
//               <div
//                 className={`transition-opacity duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{
//                   transitionDelay: "300ms",
//                   transitionProperty: "opacity, transform",
//                 }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
//                   {/* Price Header */}
//                   <div className="bg-linear-to-r from-[#2B7FFF]/15 via-[#2B7FFF]/8 to-transparent px-4 sm:px-5 lg:px-6 py-4 sm:py-5 border-b border-white/10">
//                     <p className="text-[9px] sm:text-[10px] text-[#2B7FFF]/70 uppercase tracking-[0.2em] font-bold mb-1">
//                       Asking Price
//                     </p>
//                     <p className="text-xl sm:text-2xl lg:text-3xl text-transparent bg-clip-text bg-linear-to-r from-[#8DC5FF] via-[#5AA8FF] to-[#2B7FFF] leading-none">
//                       {property.currency === "PKR" ? "Rs" : "$"}{" "}
//                       {Number(property.price)?.toLocaleString()}
//                     </p>
//                     <p className="text-white/50 text-[11px] sm:text-xs mt-1.5 capitalize tracking-wide">
//                       {property.priceType} &bull; {property.propertyType}
//                     </p>
//                   </div>

//                   {/* Trigger Button + Call/Email */}
//                   <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
//                     <button
//                       onClick={() => setShowLeadForm(true)}
//                       className="w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 bg-[#2B7FFF] text-white text-sm cursor-pointer font-bold rounded-xl hover:bg-[#4D94FF] active:scale-[0.98] transition-all shadow-lg shadow-[#2B7FFF]/25"
//                     >
//                       <Heart size={16} /> I&apos;m Interested
//                     </button>

//                     <div className="grid grid-cols-2 gap-2">
//                       <a
//                         href={`tel:${property.contact?.phone || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 border border-white/15 text-white/70 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-white/25 transition-colors hover:text-white"
//                       >
//                         <Phone size={12} /> Call
//                       </a>
//                       <a
//                         href={`mailto:${property.contact?.email || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 border border-white/15 text-white/70 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-white/25 transition-colors hover:text-white"
//                       >
//                         <Mail size={12} /> Email
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Agent */}
//               {property.addedBy && (
//                 <div
//                   className={`transition-opacity duration-500 ease-out ${
//                     isVisible
//                       ? "opacity-100 translate-y-0"
//                       : "opacity-0 translate-y-6"
//                   }`}
//                   style={{
//                     transitionDelay: "350ms",
//                     transitionProperty: "opacity, transform",
//                   }}
//                 >
//                   <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
//                     <h4 className="text-[8px] sm:text-[9px] font-bold text-white/50 uppercase tracking-[0.25em] mb-2.5 sm:mb-3">
//                       Listed By
//                     </h4>
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2B7FFF]/15 flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#2B7FFF]/20 shadow-lg">
//                         {property.addedBy?.avatar ? (
//                           <img
//                             src={property.addedBy.avatar}
//                             alt=""
//                             className="w-full h-full rounded-full object-cover"
//                           />
//                         ) : (
//                           <User size={18} className="text-[#2B7FFF]/80" />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-xs sm:text-sm font-bold text-white truncate">
//                           {property.addedBy?.name || "Agent"}
//                         </p>
//                         <p className="text-[11px] sm:text-xs text-white/50">
//                           Property Agent
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Details */}
//               <div
//                 className={`transition-opacity duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{
//                   transitionDelay: "400ms",
//                   transitionProperty: "opacity, transform",
//                 }}
//               >
//                 <div className="bg-[#1b3454] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10">
//                   <h4 className="text-[8px] sm:text-[9px] font-bold text-white/50 uppercase tracking-[0.25em] mb-2.5 sm:mb-3">
//                     Property Details
//                   </h4>
//                   <div className="space-y-0">
//                     {property.floors && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60 flex items-center gap-1.5 sm:gap-2">
//                           <Layers size={11} /> Floors
//                         </span>
//                         <span className="font-semibold text-white">
//                           {property.floors}
//                         </span>
//                       </div>
//                     )}
//                     {property.kitchens && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60">Kitchens</span>
//                         <span className="font-semibold text-white">
//                           {property.kitchens}
//                         </span>
//                       </div>
//                     )}
//                     {property.yearBuilt && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/10">
//                         <span className="text-white/60">Year Built</span>
//                         <span className="font-semibold text-white">
//                           {property.yearBuilt}
//                         </span>
//                       </div>
//                     )}
//                     {property.leadsCount > 0 && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
//                         <span className="text-white/60">Interested Buyers</span>
//                         <span className="font-semibold text-[#2B7FFF]">
//                           {property.leadsCount}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Verified */}
//               <div
//                 className={`transition-opacity duration-500 ease-out ${
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-6"
//                 }`}
//                 style={{
//                   transitionDelay: "450ms",
//                   transitionProperty: "opacity, transform",
//                 }}
//               >
//                 <div className="bg-[rgba(43,127,255,0.1)] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-[rgba(43,127,255,0.2)]">
//                   <div className="flex items-center gap-2.5 sm:gap-3">
//                     <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[rgba(43,127,255,0.2)] flex items-center justify-center shrink-0 border border-[rgba(43,127,255,0.25)]">
//                       <ShieldCheck size={13} className="text-[#2B7FFF]" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-[11px] sm:text-xs font-bold text-[#2B7FFF]">
//                         Verified Listing
//                       </p>
//                       <p className="text-[10px] sm:text-[11px] text-white/50">
//                         Verified by our team
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== LEAD FORM ===== */}
//       <LeadForm
//         propertyId={property._id}
//         propertyTitle={property.title}
//         propertyCode={property.propertyCode}
//         propertyPrice={property.price}
//         propertyCurrency={property.currency}
//         open={showLeadForm}
//         onOpenChange={setShowLeadForm}
//         trigger={null}
//         onSuccess={(data) => {
//           console.log("Lead created:", data);
//         }}
//       />

//       {/* ===== LIGHTBOX (already `fixed` intentionally — full-screen overlay, no scroll issue since page scroll is locked while open) ===== */}
//       {showLightbox && (
//         <div
//           className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
//           onClick={() => setShowLightbox(false)}
//         >
//           <button
//             onClick={() => setShowLightbox(false)}
//             className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-10 ring-1 ring-white/20"
//           >
//             <X size={18} />
//           </button>
//           <div
//             className="relative w-full h-full flex items-center justify-center px-3 sm:px-16"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               key={activeImage}
//               className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full aspect-video transition-opacity duration-300"
//             >
//               <Image
//                 src={currentDisplayImage}
//                 alt={property.title || "Property"}
//                 fill
//                 unoptimized
//                 className="object-contain"
//                 sizes="100vw"
//               />
//             </div>
//             {!hasSingleImage && (
//               <>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     prevImage();
//                   }}
//                   className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     nextImage();
//                   }}
//                   className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </>
//             )}
//           </div>
//           {!hasSingleImage && (
//             <div
//               className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 overflow-x-auto max-w-[92vw] sm:max-w-[90vw] px-3 sm:px-4"
//               style={{ scrollbarWidth: "none" }}
//             >
//               {images.map((img, index) => {
//                 const safeImg = getSafeImage(img);
//                 if (!safeImg) return null;
//                 return (
//                   <button
//                     key={index}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setActiveImage(index);
//                     }}
//                     className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-md sm:rounded-lg overflow-hidden shrink-0 transition-all duration-300 ring-1 ring-white/20 ${
//                       activeImage === index
//                         ? "ring-2 ring-[#2B7FFF] scale-105"
//                         : "opacity-50 hover:opacity-80"
//                     }`}
//                   >
//                     <Image
//                       src={safeImg}
//                       alt=""
//                       fill
//                       unoptimized
//                       className="object-cover"
//                       sizes="64px"
//                     />
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//           <div className="absolute top-3 left-3 sm:top-5 sm:left-5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/15 rounded-full ring-1 ring-white/20">
//             <span className="text-white text-[11px] sm:text-sm font-semibold">
//               {activeImage + 1} / {images.length}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   MapPin,
//   Bed,
//   Bath,
//   ArrowLeft,
//   Phone,
//   Mail,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Building2,
//   Home,
//   CalendarDays,
//   Eye,
//   Check,
//   CheckCircle2,
//   Layers,
//   ZoomIn,
//   Ruler,
//   Tag,
//   ShieldCheck,
//   Grid3x3,
//   Image as ImageIcon,
//   Crown,
//   Gem,
//   Heart,
// } from "lucide-react";
// import { getPropertyById } from "@/lib/api";
// import LeadForm from "@/components/forms/LeadForm";

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
// // SAFE IMAGE HELPER
// // ============================================
// const getSafeImage = (img) => {
//   if (!img) return null;
//   if (typeof img === "string") return img.trim();
//   if (typeof img === "object" && img?.url) return img.url.trim();
//   return null;
// };

// const PLACEHOLDER_IMG =
//   "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeImage, setActiveImage] = useState(0);
//   const [showLightbox, setShowLightbox] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [showLeadForm, setShowLeadForm] = useState(false);

//   const heroRef = useRef(null);

//   // ============================================
//   // FETCH
//   // ============================================
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         const res = await getPropertyById(id);
//         setProperty(res?.data || res);
//       } catch (err) {
//         setError("Property not found or removed");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProperty();
//   }, [id]);

//   // ============================================
//   // TRIGGER CSS ANIMATIONS
//   // ============================================
//   useEffect(() => {
//     if (!property || loading) return;
//     const timer = setTimeout(() => setIsVisible(true), 80);
//     return () => clearTimeout(timer);
//   }, [property, loading]);

//   // ============================================
//   // SAFE IMAGES
//   // ============================================
//   const rawImages = property?.images || [];
//   const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
//   const mainImage = getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

//   // ============================================
//   // IMAGE NAVIGATION
//   // ============================================
//   const nextImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev + 1) % images.length);
//   };
//   const prevImage = () => {
//     if (images.length <= 1) return;
//     setActiveImage((prev) => (prev - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!showLightbox) return;
//       if (e.key === "ArrowRight") nextImage();
//       if (e.key === "ArrowLeft") prevImage();
//       if (e.key === "Escape") setShowLightbox(false);
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [showLightbox, images.length]);

//   // ============================================
//   // SHARE
//   // ============================================
//   const handleShare = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: property?.title,
//         text: `Check out ${property?.title} at ${property?.location}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied!");
//     }
//   };

//   // ============================================
//   // LOADING
//   // ============================================
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: NAVY }}>
//         <div className="flex flex-col items-center gap-5">
//           <div className="relative">
//             <div
//               className="w-14 h-14 border-2 rounded-full animate-spin"
//               style={{ borderColor: `${TURQUOISE}20`, borderTopColor: TURQUOISE }}
//             />
//             <Gem
//               size={16}
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//               style={{ color: `${TURQUOISE}60` }}
//             />
//           </div>
//           <p className="text-sm tracking-[0.2em] uppercase" style={{ color: CREAM_40 }}>
//             Loading property...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ============================================
//   // ERROR
//   // ============================================
//   if (error || !property) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ backgroundColor: NAVY }}>
//         <div
//           className="w-20 h-20 rounded-full flex items-center justify-center border"
//           style={{ backgroundColor: `${WARM_CREAM}05`, borderColor: `${WARM_CREAM}10` }}
//         >
//           <X size={32} style={{ color: CREAM_40 }} />
//         </div>
//         <h2 className="text-xl font-bold text-white">Property Not Found</h2>
//         <p className="text-sm text-center max-w-sm" style={{ color: CREAM_50 }}>{error}</p>
//         <Link
//           href="/properties"
//           className="mt-2 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
//           style={{
//             backgroundColor: `${TURQUOISE}15`,
//             backdropFilter: "blur(8px)",
//             border: `1px solid ${TURQUOISE}30`,
//             color: TURQUOISE,
//           }}
//         >
//           <ArrowLeft size={16} /> Browse Properties
//         </Link>
//       </div>
//     );
//   }

//   const currentDisplayImage = images.length > 0 ? images[activeImage] || mainImage : mainImage;
//   const hasSingleImage = images.length <= 1;

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <div className="min-h-screen relative" style={{ backgroundColor: NAVY }}>
//       {/* Background Effects */}
//       <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, ${TURQUOISE} 1px, transparent 0)`,
//             backgroundSize: "40px 40px",
//           }}
//         />
//         <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]" />
//         <div
//           className="absolute inset-0"
//           style={{ background: `radial-gradient(ellipse at top left, ${TURQUOISE}10 0%, transparent 40%)` }}
//         />
//         <div
//           className="absolute inset-0"
//           style={{ background: `radial-gradient(ellipse at bottom right, ${PEACH}08 0%, transparent 50%)` }}
//         />
//       </div>

//       {/* ===== HERO GALLERY ===== */}
//       <div className="relative z-10 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//           {/* Breadcrumb + Badges */}
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//             <div className="flex items-center gap-2 text-sm min-w-0">
//               <Link
//                 href="/properties"
//                 className="transition-colors shrink-0"
//                 style={{ color: CREAM_60 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = TURQUOISE)}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_60)}
//               >
//                 Properties
//               </Link>
//               <ChevronRight size={14} style={{ color: CREAM_30 }} className="shrink-0" />
//               <span className="font-medium truncate" style={{ color: CREAM_90 }}>
//                 {property.title}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
//               {property.isFeatured && (
//                 <span
//                   className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full backdrop-blur-sm"
//                   style={{
//                     backgroundColor: `${TURQUOISE}20`,
//                     color: LIGHT_AQUA,
//                     border: `1px solid ${TURQUOISE}30`,
//                   }}
//                 >
//                   <Crown size={10} style={{ fill: TURQUOISE, color: TURQUOISE }} />
//                   Featured
//                 </span>
//               )}
//               <span
//                 className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full border backdrop-blur-sm ${property.status === "available" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : property.status === "sold" ? "bg-red-500/20 text-red-300 border-red-500/30" : property.status === "rented" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : property.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : property.status === "reserved" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : property.status === "under construction" ? "bg-sky-500/20 text-sky-300 border-sky-500/30" : property.status === "off plan" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : property.status === "new" ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"}`}
//               >
//                 <ShieldCheck size={10} />
//                 {property.status}
//               </span>
//               <span
//                 className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full backdrop-blur-sm"
//                 style={{
//                   backgroundColor: `${WARM_CREAM}0A`,
//                   color: CREAM_80,
//                   border: `1px solid ${WARM_CREAM}15`,
//                 }}
//               >
//                 <Tag size={10} />
//                 {property.priceType}
//               </span>
//             </div>
//           </div>

//           {/* Title & Price */}
//           <div className="mb-6 sm:mb-7">
//             <div className="flex items-center gap-3 mb-3">
//               <div
//                 className="w-8 h-px"
//                 style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
//               />
//               <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TURQUOISE }}>
//                 Exclusive Listing
//               </span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-4">
//               {property.title}
//             </h1>
//             <div className="flex flex-wrap items-center gap-4 sm:gap-8">
//               <div>
//                 <p
//                   className="text-2xl sm:text-4xl lg:text-[2.75rem] leading-none"
//                   style={{
//                     background: `linear-gradient(to right, ${LIGHT_AQUA}, ${TURQUOISE}, ${PEACH})`,
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                   }}
//                 >
//                   {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
//                 </p>
//                 {property.priceType === "rent" && (
//                   <p className="text-xs mt-1" style={{ color: CREAM_50 }}>per month</p>
//                 )}
//               </div>
//               <div className="h-10 w-px hidden sm:block" style={{ backgroundColor: `${WARM_CREAM}15` }} />
//               <div className="flex items-center gap-2 min-w-0">
//                 <MapPin size={15} style={{ color: `${TURQUOISE}80` }} className="shrink-0" />
//                 <span className="text-sm font-medium truncate" style={{ color: CREAM_90 }}>
//                   {property.location || property.city}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ===== IMAGE GALLERY ===== */}
//           <div
//             className={`transition-opacity duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
//             style={{ transitionProperty: "opacity, transform" }}
//           >
//             {hasSingleImage ? (
//               <div className="max-w-4xl mx-auto">
//                 <div className="relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 cursor-zoom-in"
//                     style={{
//                       backgroundColor: NAVY_DARK,
//                       boxShadow: `inset 0 0 0 1px ${WARM_CREAM}15`,
//                     }}
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <Image
//                       src={currentDisplayImage}
//                       alt={property.title || "Property"}
//                       fill
//                       loading="eager"
//                       unoptimized
//                       className="object-cover"
//                       sizes="(max-width: 1024px) 100vw, 66vw"
//                       priority
//                     />
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     <div
//                       className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20 transform-[translateZ(0)]"
//                     >
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div
//                       className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 ring-white/10 transform-[translateZ(0)]"
//                     >
//                       <ImageIcon size={11} style={{ color: CREAM_80 }} />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">1 Photo</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3">
//                 {/* Main Image */}
//                 <div className="lg:col-span-8 relative group">
//                   <div
//                     ref={heroRef}
//                     className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 cursor-zoom-in"
//                     style={{
//                       backgroundColor: NAVY_DARK,
//                       boxShadow: `inset 0 0 0 1px ${TURQUOISE}15`,
//                     }}
//                     onClick={() => setShowLightbox(true)}
//                   >
//                     <div key={activeImage} className="absolute inset-0 transition-opacity duration-300 ease-in-out">
//                       <Image
//                         src={currentDisplayImage}
//                         alt={property.title || "Property"}
//                         fill
//                         unoptimized
//                         className="object-cover"
//                         sizes="(max-width: 1024px) 100vw, 66vw"
//                         priority
//                       />
//                     </div>
//                     <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
//                     <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20 transform-[translateZ(0)]">
//                       <ZoomIn size={16} className="text-white" />
//                     </div>
//                     <div
//                       className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 transform-[translateZ(0)]"
//                       style={{ borderColor: `${TURQUOISE}20` }}
//                     >
//                       <Grid3x3 size={11} style={{ color: `${TURQUOISE}80` }} />
//                       <span className="text-white text-[11px] sm:text-xs font-semibold">
//                         {activeImage + 1} / {images.length}
//                       </span>
//                     </div>
//                     {/* Nav arrows */}
//                     <button
//                       onClick={(e) => { e.stopPropagation(); prevImage(); }}
//                       className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:left-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20 transform-[translateZ(0)]"
//                     >
//                       <ChevronLeft size={18} />
//                     </button>
//                     <button
//                       onClick={(e) => { e.stopPropagation(); nextImage(); }}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:right-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20 transform-[translateZ(0)]"
//                     >
//                       <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Side Thumbnails */}
//                 <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-1.5 sm:gap-2">
//                   {images.slice(0, 4).map((img, index) => {
//                     const safeImg = getSafeImage(img);
//                     if (!safeImg) return null;
//                     const isSeeMore = images.length > 4 && index === 3;
//                     const isActive = activeImage === index;
//                     return (
//                       <button
//                         key={index}
//                         onClick={() => {
//                           if (isSeeMore) { setActiveImage(3); setShowLightbox(true); }
//                           else setActiveImage(index);
//                         }}
//                         className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 aspect-square ${
//                           isActive && !isSeeMore
//                             ? "ring-2 shadow-lg"
//                             : "opacity-70 hover:opacity-100"
//                         }`}
//                         style={{
//                           boxShadow: `inset 0 0 0 1px ${WARM_CREAM}15`,
//                           ...(isActive && !isSeeMore
//                             ? { ringColor: TURQUOISE, boxShadow: `0 4px 12px ${TURQUOISE}30, inset 0 0 0 1px ${TURQUOISE}` }
//                             : {}),
//                         }}
//                       >
//                         <Image
//                           src={safeImg}
//                           alt={`Property image ${index + 1}`}
//                           fill
//                           unoptimized
//                           className="object-cover"
//                           sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
//                         />
//                         {isActive && !isSeeMore && (
//                           <div
//                             className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg z-10 border border-white"
//                             style={{ backgroundColor: TURQUOISE, boxShadow: `0 2px 8px ${TURQUOISE}50` }}
//                           >
//                             <Check size={10} strokeWidth={3} className="text-white" />
//                           </div>
//                         )}
//                         {isSeeMore && (
//                           <div className="absolute inset-0 bg-black/75 flex items-center justify-center flex-col gap-0.5 sm:gap-1 z-10 transform-[translateZ(0)]">
//                             <Grid3x3 size={14} className="text-white" />
//                             <span className="text-white text-[10px] sm:text-xs font-bold">
//                               +{images.length - 3} More
//                             </span>
//                           </div>
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
//           {/* ===== LEFT COLUMN ===== */}
//           <div className="lg:col-span-2 space-y-5 sm:space-y-6">
//             {/* Meta */}
//             {property.propertyCode && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                 style={{ transitionDelay: "50ms", transitionProperty: "opacity, transform" }}
//               >
//                 <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs" style={{ color: CREAM_60 }}>
//                   <span
//                     className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full font-semibold"
//                     style={{
//                       backgroundColor: `${TURQUOISE}15`,
//                       color: LIGHT_AQUA,
//                       border: `1px solid ${TURQUOISE}25`,
//                     }}
//                   >
//                     <Building2 size={11} />
//                     {property.propertyCode}
//                   </span>
//                   {property.viewsCount > 0 && (
//                     <span className="flex items-center gap-1" style={{ color: CREAM_60 }}>
//                       <Eye size={11} /> {property.viewsCount} views
//                     </span>
//                   )}
//                   {property.createdAt && (
//                     <span className="flex items-center gap-1" style={{ color: CREAM_60 }}>
//                       <CalendarDays size={11} />
//                       {new Date(property.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Quick Stats */}
//             <div
//               className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//               style={{ transitionDelay: "100ms", transitionProperty: "opacity, transform" }}
//             >
//               {property.bedrooms > 0 && (
//                 <div
//                   className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
//                   onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
//                 >
//                   <div
//                     className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
//                     style={{
//                       backgroundColor: `${TURQUOISE}15`,
//                       border: `1px solid ${TURQUOISE}15`,
//                     }}
//                   >
//                     <Bed size={16} style={{ color: `${TURQUOISE}80` }} />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
//                       Beds
//                     </p>
//                     <p className="text-lg sm:text-xl font-bold text-white leading-tight">{property.bedrooms}</p>
//                   </div>
//                 </div>
//               )}
//               {property.bathrooms > 0 && (
//                 <div
//                   className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
//                   onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
//                 >
//                   <div
//                     className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
//                     style={{
//                       backgroundColor: `${TURQUOISE}15`,
//                       border: `1px solid ${TURQUOISE}15`,
//                     }}
//                   >
//                     <Bath size={16} style={{ color: `${TURQUOISE}80` }} />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
//                       Baths
//                     </p>
//                     <p className="text-lg sm:text-xl font-bold text-white leading-tight">{property.bathrooms}</p>
//                   </div>
//                 </div>
//               )}
//               {(property.areaSize || property.area) > 0 && (
//                 <div
//                   className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
//                   onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
//                 >
//                   <div
//                     className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
//                     style={{
//                       backgroundColor: `${TURQUOISE}15`,
//                       border: `1px solid ${TURQUOISE}15`,
//                     }}
//                   >
//                     <Ruler size={16} style={{ color: `${TURQUOISE}80` }} />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
//                       Area
//                     </p>
//                     <p className="text-base sm:text-lg font-bold text-white leading-tight">
//                       {property.areaSize || property.area}
//                       <span className="text-[9px] sm:text-[10px] font-normal ml-0.5" style={{ color: CREAM_40 }}>
//                         {property.areaUnit || "sqft"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {property.propertyType && (
//                 <div
//                   className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
//                   onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
//                 >
//                   <div
//                     className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
//                     style={{
//                       backgroundColor: `${TURQUOISE}15`,
//                       border: `1px solid ${TURQUOISE}15`,
//                     }}
//                   >
//                     <Home size={16} style={{ color: `${TURQUOISE}80` }} />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
//                       Type
//                     </p>
//                     <p className="text-xs sm:text-sm font-bold text-white leading-tight capitalize truncate">
//                       {property.propertyType}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Description */}
//             {property.description && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                 style={{ transitionDelay: "150ms", transitionProperty: "opacity, transform" }}
//               >
//                 <div
//                   className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                 >
//                   <h3 className="text-lg sm:text-xl text-white mb-1">Description</h3>
//                   <div
//                     className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
//                     style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
//                   />
//                   <div
//                     className="text-sm sm:text-[15px] leading-[1.9] whitespace-pre-line max-h-72 sm:max-h-80 overflow-y-auto pr-2"
//                     style={{
//                       color: CREAM_70,
//                       scrollbarWidth: "thin",
//                       scrollbarColor: `${TURQUOISE}30 transparent`,
//                     }}
//                   >
//                     {property.description}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Features */}
//             {(property.features?.length > 0 || property.amenities?.length > 0) && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                 style={{ transitionDelay: "200ms", transitionProperty: "opacity, transform" }}
//               >
//                 <div
//                   className="md:block hidden rounded-2xl p-5 sm:p-7"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                 >
//                   <h3 className="text-lg sm:text-xl text-white mb-1">Features & Amenities</h3>
//                   <div
//                     className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
//                     style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
//                   />
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
//                     {[...(property.features || []), ...(property.amenities || [])].map((item, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 transition-colors group"
//                         style={{
//                           color: CREAM_70,
//                           backgroundColor: `${WARM_CREAM}05`,
//                           border: `1px solid ${WARM_CREAM}10`,
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = `${TURQUOISE}10`;
//                           e.currentTarget.style.borderColor = `${TURQUOISE}20`;
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = `${WARM_CREAM}05`;
//                           e.currentTarget.style.borderColor = `${WARM_CREAM}10`;
//                         }}
//                       >
//                         <div
//                           className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
//                           style={{ backgroundColor: `${TURQUOISE}15` }}
//                         >
//                           <CheckCircle2 size={10} style={{ color: `${TURQUOISE}80` }} />
//                         </div>
//                         <span className="capitalize truncate">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Address */}
//             {property.address && (
//               <div
//                 className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                 style={{ transitionDelay: "250ms", transitionProperty: "opacity, transform" }}
//               >
//                 <div
//                   className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                 >
//                   <h3 className="text-lg sm:text-xl text-white mb-1">Address</h3>
//                   <div
//                     className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
//                     style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
//                   />
//                   <div
//                     className="flex items-start gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl p-3 sm:p-4"
//                     style={{
//                       backgroundColor: `${TURQUOISE}08`,
//                       border: `1px solid ${TURQUOISE}15`,
//                     }}
//                   >
//                     <div
//                       className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 mt-0.5"
//                       style={{ backgroundColor: `${TURQUOISE}15` }}
//                     >
//                       <MapPin size={13} style={{ color: `${TURQUOISE}80` }} />
//                     </div>
//                     <p className="text-xs sm:text-sm leading-relaxed wrap-break-word" style={{ color: CREAM_70 }}>
//                       {property.address}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ===== RIGHT SIDEBAR ===== */}
//           <div className="lg:col-span-1">
//             <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
//               {/* Price + CTA Card */}
//               <div
//                 className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                 style={{ transitionDelay: "300ms", transitionProperty: "opacity, transform" }}
//               >
//                 <div
//                   className="rounded-xl sm:rounded-2xl overflow-hidden"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                 >
//                   {/* Price Header */}
//                   <div
//                     className="px-4 sm:px-5 lg:px-6 py-4 sm:py-5"
//                     style={{
//                       background: `linear-gradient(to right, ${TURQUOISE}12, ${TURQUOISE}06, transparent)`,
//                       borderBottom: `1px solid ${WARM_CREAM}10`,
//                     }}
//                   >
//                     <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: `${TURQUOISE}70` }}>
//                       Asking Price
//                     </p>
//                     <p
//                       className="text-xl sm:text-2xl lg:text-3xl leading-none"
//                       style={{
//                         background: `linear-gradient(to right, ${LIGHT_AQUA}, ${TURQUOISE}, ${PEACH})`,
//                         WebkitBackgroundClip: "text",
//                         WebkitTextFillColor: "transparent",
//                       }}
//                     >
//                       {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
//                     </p>
//                     <p className="text-[11px] sm:text-xs mt-1.5 capitalize tracking-wide" style={{ color: CREAM_50 }}>
//                       {property.priceType} &bull; {property.propertyType}
//                     </p>
//                   </div>

//                   {/* CTA Buttons */}
//                   <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
//                     <button
//                       onClick={() => setShowLeadForm(true)}
//                       className="w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 text-sm cursor-pointer font-bold rounded-xl active:scale-[0.98] transition-all text-white"
//                       style={{
//                         background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
//                         boxShadow: `0 4px 16px ${TURQUOISE}25`,
//                       }}
//                     >
//                       <Heart size={16} /> I&apos;m Interested
//                     </button>

//                     <div className="grid grid-cols-2 gap-2">
//                       <a
//                         href={`tel:${property.contact?.phone || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors"
//                         style={{
//                           border: `1px solid ${WARM_CREAM}15`,
//                           color: CREAM_70,
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = `${WARM_CREAM}0A`;
//                           e.currentTarget.style.borderColor = `${WARM_CREAM}25`;
//                           e.currentTarget.style.color = WARM_CREAM;
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = "transparent";
//                           e.currentTarget.style.borderColor = `${WARM_CREAM}15`;
//                           e.currentTarget.style.color = CREAM_70;
//                         }}
//                       >
//                         <Phone size={12} /> Call
//                       </a>
//                       <a
//                         href={`mailto:${property.contact?.email || ""}`}
//                         className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors"
//                         style={{
//                           border: `1px solid ${WARM_CREAM}15`,
//                           color: CREAM_70,
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = `${WARM_CREAM}0A`;
//                           e.currentTarget.style.borderColor = `${WARM_CREAM}25`;
//                           e.currentTarget.style.color = WARM_CREAM;
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = "transparent";
//                           e.currentTarget.style.borderColor = `${WARM_CREAM}15`;
//                           e.currentTarget.style.color = CREAM_70;
//                         }}
//                       >
//                         <Mail size={12} /> Email
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Agent */}
//               {property.addedBy && (
//                 <div
//                   className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                   style={{ transitionDelay: "350ms", transitionProperty: "opacity, transform" }}
//                 >
//                   <div
//                     className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
//                     style={{
//                       backgroundColor: NAVY_CARD,
//                       border: `1px solid ${WARM_CREAM}10`,
//                     }}
//                   >
//                     <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3" style={{ color: CREAM_50 }}>
//                       Listed By
//                     </h4>
//                     <div className="flex items-center gap-3">
//                       <div
//                         className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
//                         style={{
//                           backgroundColor: `${TURQUOISE}15`,
//                           border: `2px solid ${TURQUOISE}25`,
//                           boxShadow: `0 4px 12px ${TURQUOISE}20`,
//                         }}
//                       >
//                         {property.addedBy?.avatar ? (
//                           <img src={property.addedBy.avatar} alt="" className="w-full h-full rounded-full object-cover" />
//                         ) : (
//                           <User size={18} style={{ color: `${TURQUOISE}80` }} />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-xs sm:text-sm font-bold text-white truncate">
//                           {property.addedBy?.name || "Agent"}
//                         </p>
//                         <p className="text-[11px] sm:text-xs" style={{ color: CREAM_50 }}>
//                           Property Agent
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Details */}
//               <div
//                 className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                 style={{ transitionDelay: "400ms", transitionProperty: "opacity, transform" }}
//               >
//                 <div
//                   className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
//                   style={{
//                     backgroundColor: NAVY_CARD,
//                     border: `1px solid ${WARM_CREAM}10`,
//                   }}
//                 >
//                   <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3" style={{ color: CREAM_50 }}>
//                     Property Details
//                   </h4>
//                   <div className="space-y-0">
//                     {property.floors && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${WARM_CREAM}10` }}>
//                         <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
//                           <Layers size={11} /> Floors
//                         </span>
//                         <span className="font-semibold text-white">{property.floors}</span>
//                       </div>
//                     )}
//                     {property.kitchens && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${WARM_CREAM}10` }}>
//                         <span style={{ color: CREAM_60 }}>Kitchens</span>
//                         <span className="font-semibold text-white">{property.kitchens}</span>
//                       </div>
//                     )}
//                     {property.yearBuilt && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${WARM_CREAM}10` }}>
//                         <span style={{ color: CREAM_60 }}>Year Built</span>
//                         <span className="font-semibold text-white">{property.yearBuilt}</span>
//                       </div>
//                     )}
//                     {property.leadsCount > 0 && (
//                       <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
//                         <span style={{ color: CREAM_60 }}>Interested Buyers</span>
//                         <span className="font-semibold" style={{ color: TURQUOISE }}>{property.leadsCount}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Verified */}
//               <div
//                 className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
//                 style={{ transitionDelay: "450ms", transitionProperty: "opacity, transform" }}
//               >
//                 <div
//                   className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4"
//                   style={{
//                     backgroundColor: `${PEACH}10`,
//                     border: `1px solid ${PEACH}20`,
//                   }}
//                 >
//                   <div className="flex items-center gap-2.5 sm:gap-3">
//                     <div
//                       className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0"
//                       style={{
//                         backgroundColor: `${PEACH}20`,
//                         border: `1px solid ${PEACH}30`,
//                       }}
//                     >
//                       <ShieldCheck size={13} style={{ color: PEACH }} />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-[11px] sm:text-xs font-bold" style={{ color: PEACH }}>
//                         Verified Listing
//                       </p>
//                       <p className="text-[10px] sm:text-[11px]" style={{ color: CREAM_50 }}>
//                         Verified by our team
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== LEAD FORM ===== */}
//       <LeadForm
//         propertyId={property._id}
//         propertyTitle={property.title}
//         propertyCode={property.propertyCode}
//         propertyPrice={property.price}
//         propertyCurrency={property.currency}
//         open={showLeadForm}
//         onOpenChange={setShowLeadForm}
//         trigger={null}
//         onSuccess={(data) => console.log("Lead created:", data)}
//       />

//       {/* ===== LIGHTBOX ===== */}
//       {showLightbox && (
//         <div
//           className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
//           onClick={() => setShowLightbox(false)}
//         >
//           <button
//             onClick={() => setShowLightbox(false)}
//             className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-10 ring-1 ring-white/20"
//           >
//             <X size={18} />
//           </button>
//           <div
//             className="relative w-full h-full flex items-center justify-center px-3 sm:px-16"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div key={activeImage} className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full aspect-video transition-opacity duration-300">
//               <Image
//                 src={currentDisplayImage}
//                 alt={property.title || "Property"}
//                 fill
//                 unoptimized
//                 className="object-contain"
//                 sizes="100vw"
//               />
//             </div>
//             {!hasSingleImage && (
//               <>
//                 <button
//                   onClick={(e) => { e.stopPropagation(); prevImage(); }}
//                   className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <button
//                   onClick={(e) => { e.stopPropagation(); nextImage(); }}
//                   className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </>
//             )}
//           </div>
//           {!hasSingleImage && (
//             <div
//               className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 overflow-x-auto max-w-[92vw] sm:max-w-[90vw] px-3 sm:px-4"
//               style={{ scrollbarWidth: "none" }}
//             >
//               {images.map((img, index) => {
//                 const safeImg = getSafeImage(img);
//                 if (!safeImg) return null;
//                 return (
//                   <button
//                     key={index}
//                     onClick={(e) => { e.stopPropagation(); setActiveImage(index); }}
//                     className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-md sm:rounded-lg overflow-hidden shrink-0 transition-all duration-300 ring-1 ring-white/20 ${
//                       activeImage === index ? "scale-105" : "opacity-50 hover:opacity-80"
//                     }`}
//                     style={activeImage === index ? { ringColor: TURQUOISE, boxShadow: `0 0 0 2px ${TURQUOISE}` } : {}}
//                   >
//                     <Image src={safeImg} alt="" fill unoptimized className="object-cover" sizes="64px" />
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//           <div className="absolute top-3 left-3 sm:top-5 sm:left-5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/15 rounded-full ring-1 ring-white/20">
//             <span className="text-white text-[11px] sm:text-sm font-semibold">
//               {activeImage + 1} / {images.length}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  ArrowLeft,
  Phone,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Home,
  CalendarDays,
  Eye,
  Check,
  CheckCircle2,
  Layers,
  ZoomIn,
  Ruler,
  Tag,
  ShieldCheck,
  Grid3x3,
  Image as ImageIcon,
  Crown,
  Gem,
  Heart,
} from "lucide-react";
import { getPropertyById } from "@/lib/api";
import LeadForm from "@/components/forms/LeadForm";

// ==========================================
// ✅ COLOR PALETTE
// ==========================================
const TURQUOISE = "#20B2B8";
const LIGHT_AQUA = "#BEEBF0";
const DARK_PINK = "#D81B60";
const DARK_ORANGE = "#F2673A";
const PEACH = "#FFC8B5";
const WARM_CREAM = "#FFF7F0";
const WARM_TAUPE = "#D9D2C7";
const NAVY = "#1F2D3D";

const NAVY_LIGHT = "#263848";
const NAVY_DARK = "#172636";
const NAVY_CARD = "#1E3040";

const CREAM_30 = "#FFF7F04D";
const CREAM_40 = "#FFF7F066";
const CREAM_50 = "#FFF7F080";
const CREAM_60 = "#FFF7F099";
const CREAM_70 = "#FFF7F0B3";
const CREAM_75 = "#FFF7F0BF";
const CREAM_80 = "#FFF7F0CC";
const CREAM_90 = "#FFF7F0E6";

// ==========================================
// ✅ HTML DECODE HELPER (Fixes raw tags issue)
// ==========================================
const decodeHtml = (html) => {
  if (!html) return "";
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const heroRef = useRef(null);

  // ============================================
  // FETCH
  // ============================================
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await getPropertyById(id);
        setProperty(res?.data || res);
      } catch (err) {
        setError("Property not found or removed");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  // ============================================
  // TRIGGER CSS ANIMATIONS
  // ============================================
  useEffect(() => {
    if (!property || loading) return;
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, [property, loading]);

  // ============================================
  // SAFE IMAGES
  // ============================================
  const rawImages = property?.images || [];
  const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
  const mainImage = getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

  // ============================================
  // IMAGE NAVIGATION
  // ============================================
  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setShowLightbox(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, images.length]);

  // ============================================
  // SHARE
  // ============================================
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property?.title,
        text: `Check out ${property?.title} at ${property?.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: NAVY }}>
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div
              className="w-14 h-14 border-2 rounded-full animate-spin"
              style={{ borderColor: `${TURQUOISE}20`, borderTopColor: TURQUOISE }}
            />
            <Gem
              size={16}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ color: `${TURQUOISE}60` }}
            />
          </div>
          <p className="text-sm tracking-[0.2em] uppercase" style={{ color: CREAM_40 }}>
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ backgroundColor: NAVY }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center border"
          style={{ backgroundColor: `${WARM_CREAM}05`, borderColor: `${WARM_CREAM}10` }}
        >
          <X size={32} style={{ color: CREAM_40 }} />
        </div>
        <h2 className="text-xl font-bold text-white">Property Not Found</h2>
        <p className="text-sm text-center max-w-sm" style={{ color: CREAM_50 }}>{error}</p>
        <Link
          href="/properties"
          className="mt-2 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
          style={{
            backgroundColor: `${TURQUOISE}15`,
            backdropFilter: "blur(8px)",
            border: `1px solid ${TURQUOISE}30`,
            color: TURQUOISE,
          }}
        >
          <ArrowLeft size={16} /> Browse Properties
        </Link>
      </div>
    );
  }

  const currentDisplayImage = images.length > 0 ? images[activeImage] || mainImage : mainImage;
  const hasSingleImage = images.length <= 1;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: NAVY }}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${TURQUOISE} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]" />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at top left, ${TURQUOISE}10 0%, transparent 40%)` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at bottom right, ${PEACH}08 0%, transparent 50%)` }}
        />
      </div>

      {/* ===== HERO GALLERY ===== */}
      <div className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Breadcrumb + Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <Link
                href="/properties"
                className="transition-colors shrink-0"
                style={{ color: CREAM_60 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TURQUOISE)}
                onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_60)}
              >
                Properties
              </Link>
              <ChevronRight size={14} style={{ color: CREAM_30 }} className="shrink-0" />
              <span className="font-medium truncate" style={{ color: CREAM_90 }}>
                {property.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {property.isFeatured && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full backdrop-blur-sm"
                  style={{
                    backgroundColor: `${TURQUOISE}20`,
                    color: LIGHT_AQUA,
                    border: `1px solid ${TURQUOISE}30`,
                  }}
                >
                  <Crown size={10} style={{ fill: TURQUOISE, color: TURQUOISE }} />
                  Featured
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full border backdrop-blur-sm ${property.status === "available" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : property.status === "sold" ? "bg-red-500/20 text-red-300 border-red-500/30" : property.status === "rented" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : property.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : property.status === "reserved" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : property.status === "under construction" ? "bg-sky-500/20 text-sky-300 border-sky-500/30" : property.status === "off plan" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : property.status === "new" ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"}`}
              >
                <ShieldCheck size={10} />
                {property.status}
              </span>
              <span
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: `${WARM_CREAM}0A`,
                  color: CREAM_80,
                  border: `1px solid ${WARM_CREAM}15`,
                }}
              >
                <Tag size={10} />
                {property.priceType}
              </span>
            </div>
          </div>

          {/* Title & Price */}
          <div className="mb-6 sm:mb-7">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: TURQUOISE }}>
                Exclusive Listing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl text-white tracking-tight leading-[1.15] mb-4">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <div>
                <p
                  className="text-2xl sm:text-4xl lg:text-[2.75rem] leading-none"
                  style={{
                    background: `linear-gradient(to right, ${LIGHT_AQUA}, ${TURQUOISE}, ${PEACH})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
                </p>
                {property.priceType === "rent" && (
                  <p className="text-xs mt-1" style={{ color: CREAM_50 }}>per month</p>
                )}
              </div>
              <div className="h-10 w-px hidden sm:block" style={{ backgroundColor: `${WARM_CREAM}15` }} />
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={15} style={{ color: `${TURQUOISE}80` }} className="shrink-0" />
                <span className="text-sm font-medium truncate" style={{ color: CREAM_90 }}>
                  {property.location || property.city}
                </span>
              </div>
            </div>
          </div>

          {/* ===== IMAGE GALLERY ===== */}
          <div
            className={`transition-opacity duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionProperty: "opacity, transform" }}
          >
            {hasSingleImage ? (
              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  <div
                    ref={heroRef}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 cursor-zoom-in"
                    style={{
                      backgroundColor: NAVY_DARK,
                      boxShadow: `inset 0 0 0 1px ${WARM_CREAM}15`,
                    }}
                    onClick={() => setShowLightbox(true)}
                  >
                    <Image
                      src={currentDisplayImage}
                      alt={property.title || "Property"}
                      fill
                      loading="eager"
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20 transform-[translateZ(0)]"
                    >
                      <ZoomIn size={16} className="text-white" />
                    </div>
                    <div
                      className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 ring-white/10 transform-[translateZ(0)]"
                    >
                      <ImageIcon size={11} style={{ color: CREAM_80 }} />
                      <span className="text-white text-[11px] sm:text-xs font-semibold">1 Photo</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3">
                {/* Main Image */}
                <div className="lg:col-span-8 relative group">
                  <div
                    ref={heroRef}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 cursor-zoom-in"
                    style={{
                      backgroundColor: NAVY_DARK,
                      boxShadow: `inset 0 0 0 1px ${TURQUOISE}15`,
                    }}
                    onClick={() => setShowLightbox(true)}
                  >
                    <div key={activeImage} className="absolute inset-0 transition-opacity duration-300 ease-in-out">
                      <Image
                        src={currentDisplayImage}
                        alt={property.title || "Property"}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority
                      />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20 transform-[translateZ(0)]">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                    <div
                      className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 transform-[translateZ(0)]"
                      style={{ borderColor: `${TURQUOISE}20` }}
                    >
                      <Grid3x3 size={11} style={{ color: `${TURQUOISE}80` }} />
                      <span className="text-white text-[11px] sm:text-xs font-semibold">
                        {activeImage + 1} / {images.length}
                      </span>
                    </div>
                    {/* Nav arrows */}
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:left-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20 transform-[translateZ(0)]"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:right-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20 transform-[translateZ(0)]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Side Thumbnails */}
                <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-1.5 sm:gap-2">
                  {images.slice(0, 4).map((img, index) => {
                    const safeImg = getSafeImage(img);
                    if (!safeImg) return null;
                    const isSeeMore = images.length > 4 && index === 3;
                    const isActive = activeImage === index;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (isSeeMore) { setActiveImage(3); setShowLightbox(true); }
                          else setActiveImage(index);
                        }}
                        className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 aspect-square ${
                          isActive && !isSeeMore
                            ? "ring-2 shadow-lg"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        style={{
                          boxShadow: `inset 0 0 0 1px ${WARM_CREAM}15`,
                          ...(isActive && !isSeeMore
                            ? { ringColor: TURQUOISE, boxShadow: `0 4px 12px ${TURQUOISE}30, inset 0 0 0 1px ${TURQUOISE}` }
                            : {}),
                        }}
                      >
                        <Image
                          src={safeImg}
                          alt={`Property image ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                        />
                        {isActive && !isSeeMore && (
                          <div
                            className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg z-10 border border-white"
                            style={{ backgroundColor: TURQUOISE, boxShadow: `0 2px 8px ${TURQUOISE}50` }}
                          >
                            <Check size={10} strokeWidth={3} className="text-white" />
                          </div>
                        )}
                        {isSeeMore && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center flex-col gap-0.5 sm:gap-1 z-10 transform-[translateZ(0)]">
                            <Grid3x3 size={14} className="text-white" />
                            <span className="text-white text-[10px] sm:text-xs font-bold">
                              +{images.length - 3} More
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Meta */}
            {property.propertyCode && (
              <div
                className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "50ms", transitionProperty: "opacity, transform" }}
              >
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs" style={{ color: CREAM_60 }}>
                  <span
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: `${TURQUOISE}15`,
                      color: LIGHT_AQUA,
                      border: `1px solid ${TURQUOISE}25`,
                    }}
                  >
                    <Building2 size={11} />
                    {property.propertyCode}
                  </span>
                  {property.viewsCount > 0 && (
                    <span className="flex items-center gap-1" style={{ color: CREAM_60 }}>
                      <Eye size={11} /> {property.viewsCount} views
                    </span>
                  )}
                  {property.createdAt && (
                    <span className="flex items-center gap-1" style={{ color: CREAM_60 }}>
                      <CalendarDays size={11} />
                      {new Date(property.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "100ms", transitionProperty: "opacity, transform" }}
            >
              {property.bedrooms > 0 && (
                <div
                  className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
                >
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${TURQUOISE}15`,
                      border: `1px solid ${TURQUOISE}15`,
                    }}
                  >
                    <Bed size={16} style={{ color: `${TURQUOISE}80` }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
                      Beds
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-white leading-tight">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div
                  className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
                >
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${TURQUOISE}15`,
                      border: `1px solid ${TURQUOISE}15`,
                    }}
                  >
                    <Bath size={16} style={{ color: `${TURQUOISE}80` }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
                      Baths
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-white leading-tight">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {(property.areaSize || property.area) > 0 && (
                <div
                  className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
                >
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${TURQUOISE}15`,
                      border: `1px solid ${TURQUOISE}15`,
                    }}
                  >
                    <Ruler size={16} style={{ color: `${TURQUOISE}80` }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
                      Area
                    </p>
                    <p className="text-base sm:text-lg font-bold text-white leading-tight">
                      {property.areaSize || property.area}
                      <span className="text-[9px] sm:text-[10px] font-normal ml-0.5" style={{ color: CREAM_40 }}>
                        {property.areaUnit || "sqft"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {property.propertyType && (
                <div
                  className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all group"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${TURQUOISE}30`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${WARM_CREAM}10`)}
                >
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: `${TURQUOISE}15`,
                      border: `1px solid ${TURQUOISE}15`,
                    }}
                  >
                    <Home size={16} style={{ color: `${TURQUOISE}80` }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: CREAM_50 }}>
                      Type
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white leading-tight capitalize truncate">
                      {property.propertyType}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div
                className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "150ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                >
                  <h3 className="text-lg sm:text-xl text-white mb-1">Description</h3>
                  <div
                    className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
                    style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
                  />
                  {/* ✅ FIXED: Replaced plain text with dangerouslySetInnerHTML for Rich Text */}
                  <div
                    className="text-sm sm:text-[15px] leading-[1.9] max-h-72 sm:max-h-80 overflow-y-auto pr-2 overflow-hidden wrap-break-word
                               [&_p]:my-2 [&_div]:my-2 
                               [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 
                               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 
                               [&_li]:ml-2 [&_li]:my-1 
                               [&_h1]:text-base [&_h1]:font-bold [&_h1]:my-2 [&_h1]:text-white
                               [&_h2]:text-sm [&_h2]:font-bold [&_h2]:my-2 [&_h2]:text-white
                               [&_blockquote]:border-l-4 [&_blockquote]:border-[#20B2B8] [&_blockquote]:pl-4 [&_blockquote]:italic"
                    style={{
                      color: CREAM_70,
                      scrollbarWidth: "thin",
                      scrollbarColor: `${TURQUOISE}30 transparent`,
                    }}
                    dangerouslySetInnerHTML={{ __html: decodeHtml(property.description) || "No description available." }}
                  />
                </div>
              </div>
            )}

            {/* Features */}
            {(property.features?.length > 0 || property.amenities?.length > 0) && (
              <div
                className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "200ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="md:block hidden rounded-2xl p-5 sm:p-7"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                >
                  <h3 className="text-lg sm:text-xl text-white mb-1">Features & Amenities</h3>
                  <div
                    className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
                    style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {[...(property.features || []), ...(property.amenities || [])].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 transition-colors group"
                        style={{
                          color: CREAM_70,
                          backgroundColor: `${WARM_CREAM}05`,
                          border: `1px solid ${WARM_CREAM}10`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${TURQUOISE}10`;
                          e.currentTarget.style.borderColor = `${TURQUOISE}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${WARM_CREAM}05`;
                          e.currentTarget.style.borderColor = `${WARM_CREAM}10`;
                        }}
                      >
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
                          style={{ backgroundColor: `${TURQUOISE}15` }}
                        >
                          <CheckCircle2 size={10} style={{ color: `${TURQUOISE}80` }} />
                        </div>
                        <span className="capitalize truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Address */}
            {property.address && (
              <div
                className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "250ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                >
                  <h3 className="text-lg sm:text-xl text-white mb-1">Address</h3>
                  <div
                    className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
                    style={{ background: `linear-gradient(to right, ${TURQUOISE}, transparent)` }}
                  />
                  <div
                    className="flex items-start gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl p-3 sm:p-4"
                    style={{
                      backgroundColor: `${TURQUOISE}08`,
                      border: `1px solid ${TURQUOISE}15`,
                    }}
                  >
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${TURQUOISE}15` }}
                    >
                      <MapPin size={13} style={{ color: `${TURQUOISE}80` }} />
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed wrap-break-word" style={{ color: CREAM_70 }}>
                      {property.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
              {/* Price + CTA Card */}
              <div
                className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "300ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                >
                  {/* Price Header */}
                  <div
                    className="px-4 sm:px-5 lg:px-6 py-4 sm:py-5"
                    style={{
                      background: `linear-gradient(to right, ${TURQUOISE}12, ${TURQUOISE}06, transparent)`,
                      borderBottom: `1px solid ${WARM_CREAM}10`,
                    }}
                  >
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: `${TURQUOISE}70` }}>
                      Asking Price
                    </p>
                    <p
                      className="text-xl sm:text-2xl lg:text-3xl leading-none"
                      style={{
                        background: `linear-gradient(to right, ${LIGHT_AQUA}, ${TURQUOISE}, ${PEACH})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
                    </p>
                    <p className="text-[11px] sm:text-xs mt-1.5 capitalize tracking-wide" style={{ color: CREAM_50 }}>
                      {property.priceType} &bull; {property.propertyType}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                    <button
                      onClick={() => setShowLeadForm(true)}
                      className="w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 text-sm cursor-pointer font-bold rounded-xl active:scale-[0.98] transition-all text-white"
                      style={{
                        background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
                        boxShadow: `0 4px 16px ${TURQUOISE}25`,
                      }}
                    >
                      <Heart size={16} /> I&apos;m Interested
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${property.contact?.phone || ""}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors"
                        style={{
                          border: `1px solid ${WARM_CREAM}15`,
                          color: CREAM_70,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${WARM_CREAM}0A`;
                          e.currentTarget.style.borderColor = `${WARM_CREAM}25`;
                          e.currentTarget.style.color = WARM_CREAM;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderColor = `${WARM_CREAM}15`;
                          e.currentTarget.style.color = CREAM_70;
                        }}
                      >
                        <Phone size={12} /> Call
                      </a>
                      <a
                        href={`mailto:${property.contact?.email || ""}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors"
                        style={{
                          border: `1px solid ${WARM_CREAM}15`,
                          color: CREAM_70,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${WARM_CREAM}0A`;
                          e.currentTarget.style.borderColor = `${WARM_CREAM}25`;
                          e.currentTarget.style.color = WARM_CREAM;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderColor = `${WARM_CREAM}15`;
                          e.currentTarget.style.color = CREAM_70;
                        }}
                      >
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent */}
              {property.addedBy && (
                <div
                  className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: "350ms", transitionProperty: "opacity, transform" }}
                >
                  <div
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                    style={{
                      backgroundColor: NAVY_CARD,
                      border: `1px solid ${WARM_CREAM}10`,
                    }}
                  >
                    <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3" style={{ color: CREAM_50 }}>
                      Listed By
                    </h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                        style={{
                          backgroundColor: `${TURQUOISE}15`,
                          border: `2px solid ${TURQUOISE}25`,
                          boxShadow: `0 4px 12px ${TURQUOISE}20`,
                        }}
                      >
                        {property.addedBy?.avatar ? (
                          <img src={property.addedBy.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User size={18} style={{ color: `${TURQUOISE}80` }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-white truncate">
                          {property.addedBy?.name || "Agent"}
                        </p>
                        <p className="text-[11px] sm:text-xs" style={{ color: CREAM_50 }}>
                          Property Agent
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details */}
              <div
                className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "400ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                >
                  <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3" style={{ color: CREAM_50 }}>
                    Property Details
                  </h4>
                  <div className="space-y-0">
                    {property.floors && (
                      <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${WARM_CREAM}10` }}>
                        <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                          <Layers size={11} /> Floors
                        </span>
                        <span className="font-semibold text-white">{property.floors}</span>
                      </div>
                    )}
                    {property.kitchens && (
                      <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${WARM_CREAM}10` }}>
                        <span style={{ color: CREAM_60 }}>Kitchens</span>
                        <span className="font-semibold text-white">{property.kitchens}</span>
                      </div>
                    )}
                    {property.yearBuilt && (
                      <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${WARM_CREAM}10` }}>
                        <span style={{ color: CREAM_60 }}>Year Built</span>
                        <span className="font-semibold text-white">{property.yearBuilt}</span>
                      </div>
                    )}
                    {property.leadsCount > 0 && (
                      <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
                        <span style={{ color: CREAM_60 }}>Interested Buyers</span>
                        <span className="font-semibold" style={{ color: TURQUOISE }}>{property.leadsCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verified */}
              <div
                className={`transition-opacity duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: "450ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4"
                  style={{
                    backgroundColor: `${PEACH}10`,
                    border: `1px solid ${PEACH}20`,
                  }}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${PEACH}20`,
                        border: `1px solid ${PEACH}30`,
                      }}
                    >
                      <ShieldCheck size={13} style={{ color: PEACH }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-bold" style={{ color: PEACH }}>
                        Verified Listing
                      </p>
                      <p className="text-[10px] sm:text-[11px]" style={{ color: CREAM_50 }}>
                        Verified by our team
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LEAD FORM ===== */}
      <LeadForm
        propertyId={property._id}
        propertyTitle={property.title}
        propertyCode={property.propertyCode}
        propertyPrice={property.price}
        propertyCurrency={property.currency}
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        trigger={null}
        onSuccess={(data) => console.log("Lead created:", data)}
      />

      {/* ===== LIGHTBOX ===== */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-10 ring-1 ring-white/20"
          >
            <X size={18} />
          </button>
          <div
            className="relative w-full h-full flex items-center justify-center px-3 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div key={activeImage} className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full aspect-video transition-opacity duration-300">
              <Image
                src={currentDisplayImage}
                alt={property.title || "Property"}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
                priority
              />
            </div>

            {/* Lightbox Nav Arrows */}
            {!hasSingleImage && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}