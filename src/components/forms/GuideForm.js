// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   User,
//   Phone,
//   Mail,
//   BookOpen,
//   CheckCircle2,
//   Loader2,
//   Download,
//   FileText,
// } from "lucide-react";
// import { downloadGuide } from "@/lib/api";
// import { Playfair_Display, Inter } from "next/font/google";

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

// /**
//  * =============================================
//  * REUSABLE GUIDE DOWNLOAD FORM
//  * =============================================
//  *
//  * BUYER GUIDE:
//  *   <GuideForm guideType="buyer" />
//  *
//  * SELLER GUIDE:
//  *   <GuideForm guideType="seller" />
//  *
//  * CUSTOM TRIGGER:
//  *   <GuideForm
//  *     guideType="buyer"
//  *     trigger={<button>Get Free Guide</button>}
//  *   />
//  *
//  * CONTROLLED:
//  *   <GuideForm
//  *     guideType="seller"
//  *     open={isOpen}
//  *     onOpenChange={setIsOpen}
//  *   />
//  * =============================================
//  */
// export default function GuideForm({
//   guideType, // "buyer" ya "seller" — REQUIRED
//   trigger,
//   open: controlledOpen,
//   onOpenChange: setControlledOpen,
//   onSuccess,
//   className = "",
// }) {
//   // ---- Open State ----
//   const [internalOpen, setInternalOpen] = useState(false);
//   const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const setOpen = setControlledOpen || setInternalOpen;

//   // ---- Form State ----
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const nameRef = useRef(null);

//   // Guide labels
//   const isBuyer = guideType === "buyer";
//   const guideLabel = isBuyer ? "Buyer" : "Seller";
//   const guideColor = isBuyer ? "#2B7FFF" : "#10B981";

//   // ---- Auto-focus ----
//   useEffect(() => {
//     if (isOpen && !submitted) {
//       const t = setTimeout(() => nameRef.current?.focus(), 350);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen, submitted]);

//   // ---- Reset form jab modal band ho ----
//   useEffect(() => {
//     if (!isOpen) {
//       const t = setTimeout(() => {
//         setForm({ name: "", email: "", phone: "" });
//         setSubmitted(false);
//         setError("");
//         setDownloadUrl(null);
//       }, 300);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen]);

//   // ---- Handlers ----
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
//       setError("All fields are required.");
//       return;
//     }

//     if (form.name.trim().length < 2) {
//       setError("Name must be at least 2 characters.");
//       return;
//     }

//     const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(form.email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         name: form.name.trim(),
//         email: form.email.trim(),
//         phone: form.phone.trim(),
//         guideType: guideType,
//       };

//       const response = await downloadGuide(payload);

//       setSubmitted(true);
//       setDownloadUrl(response?.data?.downloadUrl);
//       onSuccess?.(response?.data);
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong. Please try again.";
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ---- Download handler ----
//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = "";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     // 1 second baad auto close
//     setTimeout(() => setOpen(false), 1000);
//   };

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <>
//       {/* ---- TRIGGER ---- */}
//       {trigger ? (
//         <div onClick={() => setOpen(true)} className={className}>
//           {trigger}
//         </div>
//       ) : (
//         <button
//           onClick={() => setOpen(true)}
//           className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm cursor-pointer font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg ${className}`}
//           style={{
//             backgroundColor: guideColor,
//             boxShadow: `0 10px 25px -5px ${guideColor}40`,
//           }}
//         >
//           <Download size={16} /> Download {guideLabel} Guide
//         </button>
//       )}

//       {/* ---- MODAL ---- */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 z-1000 bg-black/70 backdrop-blur-sm"
//               onClick={() => !submitting && setOpen(false)}
//             />

//             {/* Panel */}
//             <div className="fixed inset-0 z-1001 flex items-end sm:items-center justify-center p-0 sm:p-4">
//               <motion.div
//                 initial={{ y: "100%", opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: "100%", opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 350, damping: 30 }}
//                 className="relative w-full sm:max-w-md bg-[#0d1f3c] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden border border-white/10"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* ---- HEADER ---- */}
//                 <div
//                   className="relative px-6 pt-6 pb-12 border-b border-white/10"
//                   style={{
//                     background: `linear-gradient(to right, ${guideColor}20, ${guideColor}10, transparent)`,
//                   }}
//                 >
//                   {!submitting && !submitted && (
//                     <button
//                       onClick={() => setOpen(false)}
//                       className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}

//                   <div className="flex items-center gap-3 mb-2">
//                     <div
//                       className="w-10 h-10 rounded-full flex items-center justify-center border"
//                       style={{
//                         backgroundColor: `${guideColor}20`,
//                         borderColor: `${guideColor}30`,
//                       }}
//                     >
//                       {submitted ? (
//                         <CheckCircle2 size={18} style={{ color: "#10B981" }} />
//                       ) : (
//                         <BookOpen size={18} style={{ color: guideColor }} />
//                       )}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3
//                         className={`text-white text-lg ${playfair.variable} font-(family-name:--font-playfair)`}
//                       >
//                         {submitted
//                           ? "Guide Ready!"
//                           : `${guideLabel} Guide`}
//                       </h3>
//                       <p
//                         className="text-xs truncate"
//                         style={{ color: `${guideColor}80` }}
//                       >
//                         {submitted
//                           ? "Your download is ready below"
//                           : `Free ${guideLabel.toLowerCase()} resource`}
//                       </p>
//                     </div>
//                   </div>

//                   {!submitted && (
//                     <p className="text-white/30 text-xs mt-1">
//                       Fill in your details to get instant access to our
//                       comprehensive {guideLabel.toLowerCase()} guide.
//                     </p>
//                   )}
//                 </div>

//                 {/* ---- BODY ---- */}
//                 <div className="relative px-6 pb-6 -mt-6">
//                   <div className="bg-[#0a1628] rounded-2xl border border-white/10 shadow-lg p-5">
//                     {/* SUCCESS + DOWNLOAD BUTTON */}
//                     {submitted ? (
//                       <div className="flex flex-col items-center py-8 gap-4">
//                         {/* PDF Icon */}
//                         <div
//                           className="w-20 h-20 rounded-2xl flex items-center justify-center border"
//                           style={{
//                             backgroundColor: `${guideColor}10`,
//                             borderColor: `${guideColor}20`,
//                           }}
//                         >
//                           <FileText size={32} style={{ color: guideColor }} />
//                         </div>

//                         <div className="text-center">
//                           <h4
//                             className={`text-lg text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                           >
//                             {guideLabel} Guide PDF
//                           </h4>
//                           <p className="text-sm text-white/40">
//                             Click below to download your free guide
//                           </p>
//                         </div>

//                         {/* ✅ DOWNLOAD BUTTON — sirf submit ke baad dikhega */}
//                         {downloadUrl && (
//                           <button
//                             onClick={handleDownload}
//                             className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm font-bold rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-lg"
//                             style={{
//                               backgroundColor: guideColor,
//                               boxShadow: `0 10px 25px -5px ${guideColor}40`,
//                             }}
//                           >
//                             <Download size={18} />
//                             Download {guideLabel} Guide
//                           </button>
//                         )}

//                         <button
//                           onClick={() => setOpen(false)}
//                           className="text-xs text-white/30 hover:text-white/50 transition-colors"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     ) : (
//                       /* ---- FORM ---- */
//                       <form onSubmit={handleSubmit} className="space-y-3.5">
//                         {/* Error */}
//                         {error && (
//                           <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
//                             <X size={14} className="shrink-0" />
//                             <span>{error}</span>
//                           </div>
//                         )}

//                         {/* Name */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
//                             <User size={10} />
//                             Full Name <span style={{ color: guideColor }}>*</span>
//                           </label>
//                           <input
//                             ref={nameRef}
//                             type="text"
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             placeholder="John Doe"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/15 focus:outline-none transition-all"
//                             style={{
//                               // @ts-ignore
//                               "--tw-ring-color": `${guideColor}30`,
//                             }}
//                             onFocus={(e) => {
//                               e.target.style.borderColor = `${guideColor}50`;
//                               e.target.style.boxShadow = `0 0 0 2px ${guideColor}20`;
//                             }}
//                             onBlur={(e) => {
//                               e.target.style.borderColor = "rgba(255,255,255,0.1)";
//                               e.target.style.boxShadow = "none";
//                             }}
//                           />
//                         </div>

//                         {/* Email */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
//                             <Mail size={10} />
//                             Email <span style={{ color: guideColor }}>*</span>
//                           </label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             placeholder="john@example.com"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/15 focus:outline-none transition-all"
//                             onFocus={(e) => {
//                               e.target.style.borderColor = `${guideColor}50`;
//                               e.target.style.boxShadow = `0 0 0 2px ${guideColor}20`;
//                             }}
//                             onBlur={(e) => {
//                               e.target.style.borderColor = "rgba(255,255,255,0.1)";
//                               e.target.style.boxShadow = "none";
//                             }}
//                           />
//                         </div>

//                         {/* Phone */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
//                             <Phone size={10} />
//                             Phone <span style={{ color: guideColor }}>*</span>
//                           </label>
//                           <input
//                             type="tel"
//                             name="phone"
//                             value={form.phone}
//                             onChange={handleChange}
//                             placeholder="+92 300 1234567"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/15 focus:outline-none transition-all"
//                             onFocus={(e) => {
//                               e.target.style.borderColor = `${guideColor}50`;
//                               e.target.style.boxShadow = `0 0 0 2px ${guideColor}20`;
//                             }}
//                             onBlur={(e) => {
//                               e.target.style.borderColor = "rgba(255,255,255,0.1)";
//                               e.target.style.boxShadow = "none";
//                             }}
//                           />
//                         </div>

//                         {/* Guide Type Badge */}
//                         <div
//                           className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
//                           style={{
//                             backgroundColor: `${guideColor}08`,
//                             borderColor: `${guideColor}15`,
//                           }}
//                         >
//                           <FileText
//                             size={14}
//                             style={{ color: `${guideColor}90` }}
//                             className="shrink-0"
//                           />
//                           <span className="text-xs text-white/30 flex-1">
//                             {guideLabel} Guide — Free PDF Download
//                           </span>
//                           <span
//                             className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
//                             style={{
//                               backgroundColor: `${guideColor}15`,
//                               color: guideColor,
//                             }}
//                           >
//                             Free
//                           </span>
//                         </div>

//                         {/* Submit */}
//                         <button
//                           type="submit"
//                           disabled={submitting}
//                           className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg"
//                           style={{
//                             backgroundColor: guideColor,
//                             boxShadow: `0 10px 25px -5px ${guideColor}40`,
//                           }}
//                         >
//                           {submitting ? (
//                             <>
//                               <Loader2 size={16} className="animate-spin" />{" "}
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <Download size={16} /> Get Free {guideLabel} Guide
//                             </>
//                           )}
//                         </button>

//                         <p className="text-[10px] text-white/20 text-center">
//                           We respect your privacy. No spam, ever.
//                         </p>
//                       </form>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }












// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   User,
//   Phone,
//   Mail,
//   BookOpen,
//   CheckCircle2,
//   Loader2,
//   Download,
//   FileText,
// } from "lucide-react";
// import { downloadGuide } from "@/lib/guides/api";
// import { Playfair_Display, Inter } from "next/font/google";

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

// /**
//  * =============================================
//  * REUSABLE GUIDE DOWNLOAD FORM
//  * =============================================
//  *
//  * BUYER GUIDE:
//  *   <GuideForm guideType="buyer" />
//  *
//  * SELLER GUIDE:
//  *   <GuideForm guideType="seller" />
//  *
//  * CUSTOM TRIGGER:
//  *   <GuideForm
//  *     guideType="buyer"
//  *     trigger={<button>Get Free Guide</button>}
//  *   />
//  *
//  * CONTROLLED:
//  *   <GuideForm
//  *     guideType="seller"
//  *     open={isOpen}
//  *     onOpenChange={setIsOpen}
//  *   />
//  * =============================================
//  */
// export default function GuideForm({
//   guideType, // "buyer" ya "seller" — REQUIRED
//   trigger,
//   open: controlledOpen,
//   onOpenChange: setControlledOpen,
//   onSuccess,
//   className = "",
// }) {
//   // ---- Open State ----
//   const [internalOpen, setInternalOpen] = useState(false);
//   const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const setOpen = setControlledOpen || setInternalOpen;

//   // ---- Form State ----
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const nameRef = useRef(null);

//   // Guide labels
//   const isBuyer = guideType === "buyer";
//   const guideLabel = isBuyer ? "Buyer" : "Seller";
//   const guideColor = isBuyer ? "#2B7FFF" : "#10B981";

//   // ---- Auto-focus ----
//   useEffect(() => {
//     if (isOpen && !submitted) {
//       const t = setTimeout(() => nameRef.current?.focus(), 350);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen, submitted]);

//   // ---- Reset form when modal closes ----
//   useEffect(() => {
//     if (!isOpen) {
//       const t = setTimeout(() => {
//         setForm({ name: "", email: "", phone: "" });
//         setSubmitted(false);
//         setError("");
//         setDownloadUrl(null);
//       }, 300);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen]);

//   // ---- Prevent body scroll when modal is open ----
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   // ---- Handlers ----
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
//       setError("All fields are required.");
//       return;
//     }

//     if (form.name.trim().length < 2) {
//       setError("Name must be at least 2 characters.");
//       return;
//     }

//     const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(form.email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         name: form.name.trim(),
//         email: form.email.trim(),
//         phone: form.phone.trim(),
//         guideType: guideType,
//       };

//       const response = await downloadGuide(payload);

//       setSubmitted(true);
//       setDownloadUrl(response?.data?.downloadUrl);
//       onSuccess?.(response?.data);
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong. Please try again.";
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ---- Download handler ----
//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = "";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setTimeout(() => setOpen(false), 1000);
//   };

//   // ============================================
//   // RENDER
//   // ============================================
//   return (
//     <>
//       {/* ---- TRIGGER ---- */}
//       {trigger ? (
//         <div onClick={() => setOpen(true)} className={className}>
//           {trigger}
//         </div>
//       ) : (
//         <button
//           onClick={() => setOpen(true)}
//           className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm cursor-pointer font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg ${className}`}
//           style={{
//             backgroundColor: guideColor,
//             boxShadow: `0 10px 25px -5px ${guideColor}40`,
//           }}
//         >
//           <Download size={16} /> Download {guideLabel} Guide
//         </button>
//       )}

//       {/* ---- MODAL ---- */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop – covers everything */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 z-9999  bg-black/70 rounded-2xl backdrop-blur-sm pointer-events-none"
//               onClick={() => !submitting && setOpen(false)}
//             />

//             {/* Panel – sits on top */}
//             <div className="fixed inset-0 z-10000  flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
//               <motion.div
//                 initial={{ y: "100%", opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 exit={{ y: "100%", opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 350, damping: 30 }}
//                 className="relative w-full sm:max-w-md bg-[#1b3454] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden border border-white/10 pointer-events-auto"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* ---- HEADER ---- */}
//                 <div
//                   className="relative px-6 pt-6 pb-12 border-b border-white/10"
//                   style={{
//                     background: `linear-gradient(to right, ${guideColor}20, ${guideColor}10, transparent)`,
//                   }}
//                 >
//                   {!submitting && !submitted && (
//                     <button
//                       onClick={() => setOpen(false)}
//                       className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}

//                   <div className="flex items-center gap-3 mb-2">
//                     <div
//                       className="w-10 h-10 rounded-full flex items-center justify-center border"
//                       style={{
//                         backgroundColor: `${guideColor}20`,
//                         borderColor: `${guideColor}30`,
//                       }}
//                     >
//                       {submitted ? (
//                         <CheckCircle2 size={18} style={{ color: "#10B981" }} />
//                       ) : (
//                         <BookOpen size={18} style={{ color: guideColor }} />
//                       )}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3
//                         className={`text-white text-lg ${playfair.variable} font-(family-name:--font-playfair)`}
//                       >
//                         {submitted
//                           ? "Guide Ready!"
//                           : `${guideLabel} Guide`}
//                       </h3>
//                       <p
//                         className="text-xs truncate"
//                         style={{ color: `${guideColor}80` }}
//                       >
//                         {submitted
//                           ? "Your download is ready below"
//                           : `Free ${guideLabel.toLowerCase()} resource`}
//                       </p>
//                     </div>
//                   </div>

//                   {!submitted && (
//                     <p className="text-white/40 text-xs mt-1">
//                       Fill in your details to get instant access to our
//                       comprehensive {guideLabel.toLowerCase()} guide.
//                     </p>
//                   )}
//                 </div>

//                 {/* ---- BODY ---- */}
//                 <div className="relative px-6 pb-6 -mt-6">
//                   <div className="bg-[#13273f] rounded-2xl border border-white/10 shadow-lg p-5">
//                     {/* SUCCESS + DOWNLOAD BUTTON */}
//                     {submitted ? (
//                       <div className="flex flex-col items-center py-8 gap-4">
//                         {/* PDF Icon */}
//                         <div
//                           className="w-20 h-20 rounded-2xl flex items-center justify-center border"
//                           style={{
//                             backgroundColor: `${guideColor}10`,
//                             borderColor: `${guideColor}20`,
//                           }}
//                         >
//                           <FileText size={32} style={{ color: guideColor }} />
//                         </div>

//                         <div className="text-center">
//                           <h4
//                             className={`text-lg text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                           >
//                             {guideLabel} Guide PDF
//                           </h4>
//                           <p className="text-sm text-white/40">
//                             Click below to download your free guide
//                           </p>
//                         </div>

//                         {/* Download Button */}
//                         {downloadUrl && (
//                           <button
//                             onClick={handleDownload}
//                             className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm font-bold rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-lg"
//                             style={{
//                               backgroundColor: guideColor,
//                               boxShadow: `0 10px 25px -5px ${guideColor}40`,
//                             }}
//                           >
//                             <Download size={18} />
//                             Download {guideLabel} Guide
//                           </button>
//                         )}

//                         <button
//                           onClick={() => setOpen(false)}
//                           className="text-xs text-white/30 hover:text-white/50 transition-colors"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     ) : (
//                       /* ---- FORM ---- */
//                       <form onSubmit={handleSubmit} className="space-y-3.5">
//                         {/* Error */}
//                         {error && (
//                           <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
//                             <X size={14} className="shrink-0" />
//                             <span>{error}</span>
//                           </div>
//                         )}

//                         {/* Name */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">
//                             <User size={10} />
//                             Full Name <span style={{ color: guideColor }}>*</span>
//                           </label>
//                           <input
//                             ref={nameRef}
//                             type="text"
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             placeholder="John Doe"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 focus:border-transparent transition-all"
//                           />
//                         </div>

//                         {/* Email */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">
//                             <Mail size={10} />
//                             Email <span style={{ color: guideColor }}>*</span>
//                           </label>
//                           <input
//                             type="email"
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             placeholder="john@example.com"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 focus:border-transparent transition-all"
//                           />
//                         </div>

//                         {/* Phone */}
//                         <div>
//                           <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">
//                             <Phone size={10} />
//                             Phone <span style={{ color: guideColor }}>*</span>
//                           </label>
//                           <input
//                             type="tel"
//                             name="phone"
//                             value={form.phone}
//                             onChange={handleChange}
//                             placeholder="+92 300 1234567"
//                             required
//                             className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/30 focus:border-transparent transition-all"
//                           />
//                         </div>

//                         {/* Guide Type Badge */}
//                         <div
//                           className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
//                           style={{
//                             backgroundColor: `${guideColor}08`,
//                             borderColor: `${guideColor}15`,
//                           }}
//                         >
//                           <FileText
//                             size={14}
//                             style={{ color: `${guideColor}90` }}
//                             className="shrink-0"
//                           />
//                           <span className="text-xs text-white/40 flex-1">
//                             {guideLabel} Guide — Free PDF Download
//                           </span>
//                           <span
//                             className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
//                             style={{
//                               backgroundColor: `${guideColor}15`,
//                               color: guideColor,
//                             }}
//                           >
//                             Free
//                           </span>
//                         </div>

//                         {/* Submit */}
//                         <button
//                           type="submit"
//                           disabled={submitting}
//                           className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg"
//                           style={{
//                             backgroundColor: guideColor,
//                             boxShadow: `0 10px 25px -5px ${guideColor}40`,
//                           }}
//                         >
//                           {submitting ? (
//                             <>
//                               <Loader2 size={16} className="animate-spin" />{" "}
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <Download size={16} /> Get Free {guideLabel} Guide
//                             </>
//                           )}
//                         </button>

//                         <p className="text-[10px] text-white/20 text-center">
//                           We respect your privacy. No spam, ever.
//                         </p>
//                       </form>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }








// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   X,
//   User,
//   Phone,
//   Mail,
//   BookOpen,
//   CheckCircle2,
//   Loader2,
//   Download,
//   FileText,
// } from "lucide-react";
// import { downloadGuide } from "@/lib/guides/api";
// import { Playfair_Display, Inter } from "next/font/google";

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

// /**
//  * =============================================
//  * REUSABLE GUIDE DOWNLOAD FORM
//  * =============================================
//  *
//  * BUYER GUIDE:
//  *   <GuideForm guideType="buyer" />
//  *
//  * SELLER GUIDE:
//  *   <GuideForm guideType="seller" />
//  *
//  * CUSTOM TRIGGER:
//  *   <GuideForm
//  *     guideType="buyer"
//  *     trigger={<button>Get Free Guide</button>}
//  *   />
//  *
//  * CONTROLLED:
//  *   <GuideForm
//  *     guideType="seller"
//  *     open={isOpen}
//  *     onOpenChange={setIsOpen}
//  *   />
//  * =============================================
//  */
// export default function GuideForm({
//   guideType, // "buyer" ya "seller" — REQUIRED
//   trigger,
//   open: controlledOpen,
//   onOpenChange: setControlledOpen,
//   onSuccess,
//   className = "",
// }) {
//   // ---- Open State ----
//   const [internalOpen, setInternalOpen] = useState(false);
//   const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
//   const setOpen = setControlledOpen || setInternalOpen;

//   // ---- Form State ----
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const nameRef = useRef(null);

//   // ---- Guide Config (SAME COLOR SCHEME AS SERVICES PAGE) ----
//   const isBuyer = guideType === "buyer";
//   const guideLabel = isBuyer ? "Buyer" : "Seller";
//   const guideColor = "#FAAE62"; // ✅ Same accent as services page

//   // ---- Auto-focus ----
//   useEffect(() => {
//     if (isOpen && !submitted) {
//       const t = setTimeout(() => nameRef.current?.focus(), 100);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen, submitted]);

//   // ---- Reset form when modal closes ----
//   useEffect(() => {
//     if (!isOpen) {
//       const t = setTimeout(() => {
//         setForm({ name: "", email: "", phone: "" });
//         setSubmitted(false);
//         setError("");
//         setDownloadUrl(null);
//       }, 100);
//       return () => clearTimeout(t);
//     }
//   }, [isOpen]);

//   // ---- FIX SCROLLBAR: Compensate with padding-right ----
//   useEffect(() => {
//     if (isOpen) {
//       const scrollbarWidth =
//         window.innerWidth - document.documentElement.clientWidth;
//       document.body.style.paddingRight = `${scrollbarWidth}px`;
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.paddingRight = "";
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.paddingRight = "";
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   // ---- Handlers ----
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
//       setError("All fields are required.");
//       return;
//     }

//     if (form.name.trim().length < 2) {
//       setError("Name must be at least 2 characters.");
//       return;
//     }

//     const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(form.email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         name: form.name.trim(),
//         email: form.email.trim(),
//         phone: form.phone.trim(),
//         guideType: guideType,
//       };

//       const response = await downloadGuide(payload);

//       setSubmitted(true);
//       setDownloadUrl(response?.data?.downloadUrl);
//       onSuccess?.(response?.data);
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong. Please try again.";
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ---- Download handler ----
//   const handleDownload = () => {
//     if (!downloadUrl) return;
//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = "";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setTimeout(() => setOpen(false), 1000);
//   };

//   // ============================================
//   // RENDER (NO ANIMATION — INSTANT SHOW/HIDE)
//   // ============================================
//   return (
//     <>
//       {/* ---- TRIGGER ---- */}
//       {trigger ? (
//         <div onClick={() => setOpen(true)} className={className}>
//           {trigger}
//         </div>
//       ) : (
//         <button
//           onClick={() => setOpen(true)}
//           className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm cursor-pointer font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg ${className}`}
//           style={{
//             backgroundColor: guideColor,
//             boxShadow: `0 10px 25px -5px ${guideColor}40`,
//           }}
//         >
//           <Download size={16} /> Download {guideLabel} Guide
//         </button>
//       )}

//       {/* ---- MODAL (NO FRAMER-MOTION, NO ANIMATION) ---- */}
//       {isOpen && (
//         <>
//           {/* ✅ Backdrop — clickable, no pointer-events-none */}
//           <div
//             className="fixed inset-0 z-9999 bg-black/70 rounded-2xl backdrop-blur-sm"
//             onClick={() => !submitting && setOpen(false)}
//           />

//           {/* ✅ Panel wrapper — pointer-events-none so clicks pass to backdrop */}
//           <div className="fixed inset-0 z-10000 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
//             {/* ✅ Panel itself — pointer-events-auto */}
//             <div
//               className="relative w-full sm:max-w-md bg-[#4a1d60] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden border border-white/10 pointer-events-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* ---- HEADER ---- */}
//               <div
//                 className="relative px-6 pt-6 pb-12 border-b border-white/10"
//                 style={{
//                   background: `linear-gradient(to right, ${guideColor}20, ${guideColor}10, transparent)`,
//                 }}
//               >
//                 {!submitting && !submitted && (
//                   <button
//                     onClick={() => setOpen(false)}
//                     className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}

//                 <div className="flex items-center gap-3 mb-2">
//                   <div
//                     className="w-10 h-10 rounded-full flex items-center justify-center border"
//                     style={{
//                       backgroundColor: `${guideColor}20`,
//                       borderColor: `${guideColor}30`,
//                     }}
//                   >
//                     {submitted ? (
//                       <CheckCircle2
//                         size={18}
//                         style={{ color: guideColor }}
//                       />
//                     ) : (
//                       <BookOpen size={18} style={{ color: guideColor }} />
//                     )}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <h3
//                       className={`text-white text-lg ${playfair.variable} font-(family-name:--font-playfair)`}
//                     >
//                       {submitted
//                         ? "Guide Ready!"
//                         : `${guideLabel} Guide`}
//                     </h3>
//                     <p
//                       className="text-xs truncate"
//                       style={{ color: `${guideColor}80` }}
//                     >
//                       {submitted
//                         ? "Your download is ready below"
//                         : `Free ${guideLabel.toLowerCase()} resource`}
//                     </p>
//                   </div>
//                 </div>

//                 {!submitted && (
//                   <p className="text-white/40 text-xs mt-1">
//                     Fill in your details to get instant access to our
//                     comprehensive {guideLabel.toLowerCase()} guide.
//                   </p>
//                 )}
//               </div>

//               {/* ---- BODY ---- */}
//               <div className="relative px-6 pb-6 -mt-6">
//                 {/* ✅ Inner card bg = #301143 (same as page bg) */}
//                 <div className="bg-[#301143] rounded-2xl border border-white/10 shadow-lg p-5">
//                   {/* SUCCESS + DOWNLOAD BUTTON */}
//                   {submitted ? (
//                     <div className="flex flex-col items-center py-8 gap-4">
//                       {/* PDF Icon */}
//                       <div
//                         className="w-20 h-20 rounded-2xl flex items-center justify-center border"
//                         style={{
//                           backgroundColor: `${guideColor}10`,
//                           borderColor: `${guideColor}20`,
//                         }}
//                       >
//                         <FileText
//                           size={32}
//                           style={{ color: guideColor }}
//                         />
//                       </div>

//                       <div className="text-center">
//                         <h4
//                           className={`text-lg text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
//                         >
//                           {guideLabel} Guide PDF
//                         </h4>
//                         <p className="text-sm text-white/40">
//                           Click below to download your free guide
//                         </p>
//                       </div>

//                       {/* Download Button */}
//                       {downloadUrl && (
//                         <button
//                           onClick={handleDownload}
//                           className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm font-bold rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-lg"
//                           style={{
//                             backgroundColor: guideColor,
//                             boxShadow: `0 10px 25px -5px ${guideColor}40`,
//                           }}
//                         >
//                           <Download size={18} />
//                           Download {guideLabel} Guide
//                         </button>
//                       )}

//                       <button
//                         onClick={() => setOpen(false)}
//                         className="text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer"
//                       >
//                         Close
//                       </button>
//                     </div>
//                   ) : (
//                     /* ---- FORM ---- */
//                     <form onSubmit={handleSubmit} className="space-y-3.5">
//                       {/* Error */}
//                       {error && (
//                         <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
//                           <X size={14} className="shrink-0" />
//                           <span>{error}</span>
//                         </div>
//                       )}

//                       {/* Name */}
//                       <div>
//                         <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">
//                           <User size={10} />
//                           Full Name{" "}
//                           <span style={{ color: guideColor }}>*</span>
//                         </label>
//                         <input
//                           ref={nameRef}
//                           type="text"
//                           name="name"
//                           value={form.name}
//                           onChange={handleChange}
//                           placeholder="John Doe"
//                           required
//                           className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/30 focus:border-transparent transition-all"
//                         />
//                       </div>

//                       {/* Email */}
//                       <div>
//                         <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">
//                           <Mail size={10} />
//                           Email{" "}
//                           <span style={{ color: guideColor }}>*</span>
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={form.email}
//                           onChange={handleChange}
//                           placeholder="john@example.com"
//                           required
//                           className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/30 focus:border-transparent transition-all"
//                         />
//                       </div>

//                       {/* Phone */}
//                       <div>
//                         <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">
//                           <Phone size={10} />
//                           Phone{" "}
//                           <span style={{ color: guideColor }}>*</span>
//                         </label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={form.phone}
//                           onChange={handleChange}
//                           placeholder="+92 300 1234567"
//                           required
//                           className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/30 focus:border-transparent transition-all"
//                         />
//                       </div>

//                       {/* Guide Type Badge */}
//                       <div
//                         className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
//                         style={{
//                           backgroundColor: `${guideColor}08`,
//                           borderColor: `${guideColor}15`,
//                         }}
//                       >
//                         <FileText
//                           size={14}
//                           style={{ color: `${guideColor}90` }}
//                           className="shrink-0"
//                         />
//                         <span className="text-xs text-white/40 flex-1">
//                           {guideLabel} Guide — Free PDF Download
//                         </span>
//                         <span
//                           className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
//                           style={{
//                             backgroundColor: `${guideColor}15`,
//                             color: guideColor,
//                           }}
//                         >
//                           Free
//                         </span>
//                       </div>

//                       {/* Submit */}
//                       <button
//                         type="submit"
//                         disabled={submitting}
//                         className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg"
//                         style={{
//                           backgroundColor: guideColor,
//                           boxShadow: `0 10px 25px -5px ${guideColor}40`,
//                         }}
//                       >
//                         {submitting ? (
//                           <>
//                             <Loader2 size={16} className="animate-spin" />{" "}
//                             Processing...
//                           </>
//                         ) : (
//                           <>
//                             <Download size={16} /> Get Free {guideLabel} Guide
//                           </>
//                         )}
//                       </button>

//                       <p className="text-[10px] text-white/20 text-center">
//                         We respect your privacy. No spam, ever.
//                       </p>
//                     </form>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }














"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  CheckCircle2,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import { downloadGuide } from "@/lib/guides/api";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ==========================================
// ✅ COLOR PALETTE
// ==========================================
const TURQUOISE = "#20B2B8";
const LIGHT_AQUA = "#BEEBF0";
const DARK_PINK = "#D81B60";
const DARK_ORANGE = "#F2673A";
const PEACH = "#FFC8B5";
const WARM_CREAM = "#FFF7F0";
const NAVY = "#1F2D3D";
const NAVY_CARD = "#1E3040";

const CREAM_20 = "#FFF7F033";
const CREAM_30 = "#FFF7F04D";
const CREAM_40 = "#FFF7F066";
const CREAM_50 = "#FFF7F080";
const CREAM_60 = "#FFF7F099";
const CREAM_70 = "#FFF7F0B3";
const CREAM_80 = "#FFF7F0CC";

/**
 * =============================================
 * REUSABLE GUIDE DOWNLOAD FORM
 * =============================================
 *
 * BUYER GUIDE:
 *   <GuideForm guideType="buyer" />
 *
 * SELLER GUIDE:
 *   <GuideForm guideType="seller" />
 *
 * CUSTOM TRIGGER:
 *   <GuideForm
 *     guideType="buyer"
 *     trigger={<button>Get Free Guide</button>}
 *   />
 *
 * CONTROLLED:
 *   <GuideForm
 *     guideType="seller"
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *   />
 * =============================================
 */
export default function GuideForm({
  guideType,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
  className = "",
}) {
  // ---- Open State ----
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  // ---- Form State ----
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const nameRef = useRef(null);

  // ---- Guide Config ----
  const isBuyer = guideType === "buyer";
  const guideLabel = isBuyer ? "Buyer" : "Seller";
  const guideColor = TURQUOISE;

  // ---- Auto-focus ----
  useEffect(() => {
    if (isOpen && !submitted) {
      const t = setTimeout(() => nameRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen, submitted]);

  // ---- Reset form when modal closes ----
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setForm({ name: "", email: "", phone: "" });
        setSubmitted(false);
        setError("");
        setDownloadUrl(null);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ---- FIX SCROLLBAR ----
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ---- Handlers ----
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("All fields are required.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        guideType: guideType,
      };

      const response = await downloadGuide(payload);

      setSubmitted(true);
      setDownloadUrl(response?.data?.downloadUrl);
      onSuccess?.(response?.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Download handler ----
  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setOpen(false), 1000);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* ---- TRIGGER ---- */}
      {trigger ? (
        <div onClick={() => setOpen(true)} className={className}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm cursor-pointer font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg ${className}`}
          style={{
            background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
            boxShadow: `0 10px 25px -5px ${TURQUOISE}40`,
          }}
        >
          <Download size={16} /> Download {guideLabel} Guide
        </button>
      )}

      {/* ---- MODAL ---- */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-9999 bg-black/70 rounded-2xl backdrop-blur-sm"
            onClick={() => !submitting && setOpen(false)}
          />

          {/* Panel wrapper */}
          <div className="fixed inset-0 z-10000 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            {/* Panel */}
            <div
              className="relative w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden pointer-events-auto"
              style={{
                backgroundColor: NAVY_CARD,
                border: `1px solid ${WARM_CREAM}10`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ---- HEADER ---- */}
              <div
                className="relative px-6 pt-6 pb-12"
                style={{
                  background: `linear-gradient(to right, ${guideColor}20, ${guideColor}10, transparent)`,
                  borderBottom: `1px solid ${WARM_CREAM}10`,
                }}
              >
                {!submitting && !submitted && (
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: `${WARM_CREAM}0A`,
                    }}
                  >
                    <X size={16} />
                  </button>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${guideColor}20`,
                      border: `1px solid ${guideColor}30`,
                    }}
                  >
                    {submitted ? (
                      <CheckCircle2 size={18} style={{ color: guideColor }} />
                    ) : (
                      <BookOpen size={18} style={{ color: guideColor }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`text-white text-lg ${playfair.variable} font-(family-name:--font-playfair)`}
                    >
                      {submitted ? "Guide Ready!" : `${guideLabel} Guide`}
                    </h3>
                    <p className="text-xs truncate" style={{ color: `${guideColor}80` }}>
                      {submitted
                        ? "Your download is ready below"
                        : `Free ${guideLabel.toLowerCase()} resource`}
                    </p>
                  </div>
                </div>

                {!submitted && (
                  <p style={{ color: CREAM_40 }} className="text-xs mt-1">
                    Fill in your details to get instant access to our comprehensive {guideLabel.toLowerCase()} guide.
                  </p>
                )}
              </div>

              {/* ---- BODY ---- */}
              <div className="relative px-6 pb-6 -mt-6">
                {/* Inner card bg */}
                <div
                  className="rounded-2xl shadow-lg p-5"
                  style={{
                    backgroundColor: NAVY,
                    border: `1px solid ${WARM_CREAM}10`,
                  }}
                >
                  {/* SUCCESS + DOWNLOAD */}
                  {submitted ? (
                    <div className="flex flex-col items-center py-8 gap-4">
                      {/* PDF Icon */}
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${guideColor}10`,
                          border: `1px solid ${guideColor}20`,
                        }}
                      >
                        <FileText size={32} style={{ color: guideColor }} />
                      </div>

                      <div className="text-center">
                        <h4
                          className={`text-lg text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
                        >
                          {guideLabel} Guide PDF
                        </h4>
                        <p className="text-sm" style={{ color: CREAM_40 }}>
                          Click below to download your free guide
                        </p>
                      </div>

                      {/* Download Button */}
                      {downloadUrl && (
                        <button
                          onClick={handleDownload}
                          className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm font-bold rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
                            boxShadow: `0 10px 25px -5px ${TURQUOISE}40`,
                          }}
                        >
                          <Download size={18} />
                          Download {guideLabel} Guide
                        </button>
                      )}

                      <button
                        onClick={() => setOpen(false)}
                        className="text-xs transition-colors cursor-pointer"
                        style={{ color: CREAM_30 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = CREAM_50)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_30)}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    /* ---- FORM ---- */
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      {/* Error */}
                      {error && (
                        <div
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs"
                          style={{
                            backgroundColor: `${DARK_PINK}10`,
                            border: `1px solid ${DARK_PINK}20`,
                            color: "#F87171",
                          }}
                        >
                          <X size={14} className="shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      {/* Name */}
                      <div>
                        <label
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                          style={{ color: CREAM_40 }}
                        >
                          <User size={10} />
                          Full Name <span style={{ color: guideColor }}>*</span>
                        </label>
                        <input
                          ref={nameRef}
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full px-4 py-2.5 rounded-xl text-sm text-white transition-all focus:outline-none focus:border-transparent"
                          style={{
                            backgroundColor: `${WARM_CREAM}0A`,
                            border: `1px solid ${WARM_CREAM}15`,
                            color: WARM_CREAM,
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${guideColor}30`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                          style={{ color: CREAM_40 }}
                        >
                          <Mail size={10} />
                          Email Address <span style={{ color: guideColor }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          required
                          className="w-full px-4 py-2.5 rounded-xl text-sm text-white transition-all focus:outline-none focus:border-transparent"
                          style={{
                            backgroundColor: `${WARM_CREAM}0A`,
                            border: `1px solid ${WARM_CREAM}15`,
                            color: WARM_CREAM,
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${guideColor}30`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                          style={{ color: CREAM_40 }}
                        >
                          <Phone size={10} />
                          Phone Number <span style={{ color: guideColor }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          required
                          className="w-full px-4 py-2.5 rounded-xl text-sm text-white transition-all focus:outline-none focus:border-transparent"
                          style={{
                            backgroundColor: `${WARM_CREAM}0A`,
                            border: `1px solid ${WARM_CREAM}15`,
                            color: WARM_CREAM,
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${guideColor}30`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      {/* Guide Type Badge */}
                      <div
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                        style={{
                          backgroundColor: `${guideColor}08`,
                          border: `1px solid ${guideColor}15`,
                        }}
                      >
                        <FileText
                          size={14}
                          style={{ color: `${guideColor}90` }}
                          className="shrink-0"
                        />
                        <span className="text-xs flex-1" style={{ color: CREAM_40 }}>
                          {guideLabel} Guide — Free PDF Download
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${guideColor}15`,
                            color: guideColor,
                          }}
                        >
                          Free
                        </span>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
                          boxShadow: `0 10px 25px -5px ${TURQUOISE}40`,
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <Download size={16} /> Get Free {guideLabel} Guide
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-center" style={{ color: CREAM_20 }}>
                        We respect your privacy. No spam, ever.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}