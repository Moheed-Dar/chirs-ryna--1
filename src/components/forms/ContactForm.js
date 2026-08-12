// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User,
//   Mail,
//   Phone,
//   MessageSquare,
//   Send,
//   ArrowRight,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   X,
// } from "lucide-react";
// import { submitContact } from "@/lib/contact/api";

// export default function ContactForm() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const [apiDown, setApiDown] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     if (error) setError("");
//     if (apiDown) setApiDown(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
//       setError("Please fill in all required fields");
//       return;
//     }
//     try {
//       setSubmitting(true);
//       setError("");
//       setApiDown(false);
//       const result = await submitContact({
//         name: form.name.trim(),
//         email: form.email.trim(),
//         phone: form.phone.trim() || undefined,
//         message: form.message.trim(),
//       });
//       if (result.success) {
//         setSubmitted(true);
//         setForm({ name: "", email: "", phone: "", message: "" });
//         setTimeout(() => setSubmitted(false), 5000);
//       } else {
//         setError(result.message || "Something went wrong. Please try again.");
//       }
//     } catch (err) {
//       const status = err?.response?.status;
//       if (status === 404) {
//         setApiDown(true);
//         setError(
//           "Service is temporarily unavailable. Please try again later or contact us directly via phone.",
//         );
//       } else {
//         setError(
//           err?.response?.data?.message ||
//             "Network error. Please check your connection and try again.",
//         );
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // --- More opaque inputs for smoother scrolling ---
//   const inputClass = (hasError) =>
//     `w-full px-4 py-3.5 bg-white/15 border rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#3D8BFD]/20 focus:border-[#3D8BFD]/30 transition-all ${
//       hasError ? "border-red-500/50" : "border-white/15"
//     }`;

//   return (
//     <div className="transform-gpu will-change-auto">
//       <div className="flex items-center gap-3 mb-5">
//         <div className="w-10 h-10 rounded-xl bg-[#3D8BFD]/10 flex items-center justify-center border border-[#3D8BFD]/15">
//           <MessageSquare size={16} className="text-[#3D8BFD]" />
//         </div>
//         <div>
//           <h2 className="text-lg text-white font-playfair">Send Us a Message</h2>
//           <p className="text-white/25 text-xs mt-0.5">We&apos;d love to hear from you</p>
//         </div>
//       </div>

//       <div className="w-full h-px bg-linear-to-r from-white/6 via-white/3 to-transparent mb-6" />

//       <AnimatePresence mode="wait">
//         {submitted ? (
//           <motion.div
//             key="success"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="flex flex-col items-center justify-center py-14"
//           >
//             <div className="relative">
//               <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15">
//                 <CheckCircle2 size={36} className="text-emerald-400" />
//               </div>
//               <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-3 h-3 text-white"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>
//             </div>
//             <h3 className="text-xl text-white mt-5 mb-1.5 font-playfair">
//               Message Sent!
//             </h3>
//             <p className="text-white/35 text-sm text-center max-w-xs">
//               Thank you for reaching out. We&apos;ll get back to you within 24 hours.
//             </p>
//           </motion.div>
//         ) : (
//           // --- Regular <form> without motion to prevent re-animation on scroll ---
//           <form
//             key="form"
//             onSubmit={handleSubmit}
//             className="space-y-4"
//           >
//             {/* Name */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <User size={10} /> Full Name <span className="text-[#3D8BFD]">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Enter Your Name"
//                 className={inputClass(!!error && !form.name.trim())}
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <Mail size={10} /> Email <span className="text-[#3D8BFD]">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="email@example.com"
//                 className={inputClass(!!error && !form.email.trim())}
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <Phone size={10} /> Phone Number
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="Your Phone Number (Optional)"
//                 className={inputClass(false)}
//               />
//             </div>

//             {/* Message */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <MessageSquare size={10} /> Message <span className="text-[#3D8BFD]">*</span>
//               </label>
//               <textarea
//                 name="message"
//                 value={form.message}
//                 onChange={handleChange}
//                 rows={5}
//                 placeholder="Enter your message here..."
//                 className={`${inputClass(!!error && !form.message.trim())} resize-none`}
//               />
//             </div>

//             {/* Error Message */}
//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -5 }}
//                   className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border ${
//                     apiDown
//                       ? "bg-[#3D8BFD]/5 border-[#3D8BFD]/15"
//                       : "bg-red-500/10 border-red-500/20"
//                   }`}
//                 >
//                   {apiDown ? (
//                     <AlertCircle size={16} className="text-[#3D8BFD] shrink-0 mt-0.5" />
//                   ) : (
//                     <X size={14} className="text-red-400 shrink-0 mt-0.5" />
//                   )}
//                   <p className={`text-sm leading-relaxed ${apiDown ? "text-[#7BB5FF]" : "text-red-300"}`}>
//                     {error}
//                   </p>
//                   {apiDown && (
//                     <p className="text-[11px] text-white/20 mt-1">
//                       Call us: <span className="text-[#3D8BFD]">+12269325002</span>
//                     </p>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full flex cursor-pointer items-center justify-center gap-2.5 px-6 py-3.5 bg-[#3D8BFD] text-white text-sm font-bold rounded-xl hover:bg-[#5BA2FF] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[#3D8BFD]/20"
//             >
//               {submitting ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" /> Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send size={16} /> Send Message <ArrowRight size={14} className="opacity-60" />
//                 </>
//               )}
//             </button>

//             <p className="text-center text-[10px] text-white/15 mt-2">
//               By submitting, you agree to our privacy policy.
//             </p>
//           </form>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }










// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User,
//   Mail,
//   Phone,
//   MessageSquare,
//   Send,
//   ArrowRight,
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   X,
// } from "lucide-react";
// import { submitContact } from "@/lib/contact/api";

// export default function ContactForm() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const [apiDown, setApiDown] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     if (error) setError("");
//     if (apiDown) setApiDown(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
//       setError("Please fill in all required fields");
//       return;
//     }
//     try {
//       setSubmitting(true);
//       setError("");
//       setApiDown(false);
//       const result = await submitContact({
//         name: form.name.trim(),
//         email: form.email.trim(),
//         phone: form.phone.trim() || undefined,
//         message: form.message.trim(),
//       });
//       if (result.success) {
//         setSubmitted(true);
//         setForm({ name: "", email: "", phone: "", message: "" });
//         setTimeout(() => setSubmitted(false), 5000);
//       } else {
//         setError(result.message || "Something went wrong. Please try again.");
//       }
//     } catch (err) {
//       const status = err?.response?.status;
//       if (status === 404) {
//         setApiDown(true);
//         setError(
//           "Service is temporarily unavailable. Please try again later or contact us directly via phone.",
//         );
//       } else {
//         setError(
//           err?.response?.data?.message ||
//             "Network error. Please check your connection and try again.",
//         );
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Updated input class with new color scheme
//   const inputClass = (hasError) =>
//     `w-full px-4 py-3.5 bg-white/10 border rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FAAE62]/30 focus:border-[#FAAE62]/40 transition-all ${
//       hasError ? "border-red-500/50" : "border-white/15"
//     }`;

//   return (
//     <div className="transform-gpu will-change-auto">
//       <div className="flex items-center gap-3 mb-5">
//         <div className="w-10 h-10 rounded-xl bg-[#FAAE62]/10 flex items-center justify-center border border-[#FAAE62]/20">
//           <MessageSquare size={16} className="text-[#FAAE62]" />
//         </div>
//         <div>
//           <h2 className="text-lg text-white font-playfair">Send Us a Message</h2>
//           <p className="text-white/25 text-xs mt-0.5">We&apos;d love to hear from you</p>
//         </div>
//       </div>

//       <div className="w-full h-px bg-linear-to-r from-white/10 via-white/5 to-transparent mb-6" />

//       <AnimatePresence mode="wait">
//         {submitted ? (
//           <motion.div
//             key="success"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="flex flex-col items-center justify-center py-14"
//           >
//             <div className="relative">
//               <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15">
//                 <CheckCircle2 size={36} className="text-emerald-400" />
//               </div>
//               <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-3 h-3 text-white"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>
//             </div>
//             <h3 className="text-xl text-white mt-5 mb-1.5 font-playfair">
//               Message Sent!
//             </h3>
//             <p className="text-white/35 text-sm text-center max-w-xs">
//               Thank you for reaching out. We&apos;ll get back to you within 24 hours.
//             </p>
//           </motion.div>
//         ) : (
//           <form
//             key="form"
//             onSubmit={handleSubmit}
//             className="space-y-4"
//           >
//             {/* Name */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <User size={10} /> Full Name <span className="text-[#FAAE62]">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Enter Your Name"
//                 className={inputClass(!!error && !form.name.trim())}
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <Mail size={10} /> Email <span className="text-[#FAAE62]">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="email@example.com"
//                 className={inputClass(!!error && !form.email.trim())}
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <Phone size={10} /> Phone Number
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="Your Phone Number (Optional)"
//                 className={inputClass(false)}
//               />
//             </div>

//             {/* Message */}
//             <div>
//               <label className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-1.5">
//                 <MessageSquare size={10} /> Message <span className="text-[#FAAE62]">*</span>
//               </label>
//               <textarea
//                 name="message"
//                 value={form.message}
//                 onChange={handleChange}
//                 rows={5}
//                 placeholder="Enter your message here..."
//                 className={`${inputClass(!!error && !form.message.trim())} resize-none`}
//               />
//             </div>

//             {/* Error Message */}
//             <AnimatePresence>
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -5 }}
//                   className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border ${
//                     apiDown
//                       ? "bg-[#FAAE62]/5 border-[#FAAE62]/20"
//                       : "bg-red-500/10 border-red-500/20"
//                   }`}
//                 >
//                   {apiDown ? (
//                     <AlertCircle size={16} className="text-[#FAAE62] shrink-0 mt-0.5" />
//                   ) : (
//                     <X size={14} className="text-red-400 shrink-0 mt-0.5" />
//                   )}
//                   <p className={`text-sm leading-relaxed ${apiDown ? "text-[#FAAE62]" : "text-red-300"}`}>
//                     {error}
//                   </p>
//                   {apiDown && (
//                     <p className="text-[11px] text-white/20 mt-1">
//                       Call us: <span className="text-[#FAAE62]">+12269325002</span>
//                     </p>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full flex cursor-pointer items-center justify-center gap-2.5 px-6 py-3.5 bg-[#FAAE62] hover:bg-[#ffbb7d] text-[#301143] text-sm font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[#FAAE62]/30"
//             >
//               {submitting ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" /> Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send size={16} /> Send Message <ArrowRight size={14} className="opacity-70" />
//                 </>
//               )}
//             </button>

//             <p className="text-center text-[10px] text-white/15 mt-2">
//               By submitting, you agree to our privacy policy.
//             </p>
//           </form>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }













"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { submitContact } from "@/lib/contact/api";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [apiDown, setApiDown] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (apiDown) setApiDown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      setApiDown(false);
      const result = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      if (result.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setApiDown(true);
        setError(
          "Service is temporarily unavailable. Please try again later or contact us directly via phone.",
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Network error. Please check your connection and try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Updated input class with new color scheme
  const inputClass = (hasError) =>
    `w-full px-4 py-3.5 bg-[#FFF7F0]/10 border rounded-xl text-sm text-[#FFF7F0] placeholder-[#FFF7F0]/40 focus:outline-none focus:ring-2 focus:ring-[#20B2B8]/30 focus:border-[#20B2B8]/40 transition-all ${
      hasError ? "border-red-500/50" : "border-[#FFF7F0]/15"
    }`;

  return (
    <div className="transform-gpu will-change-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#20B2B8]/10 flex items-center justify-center border border-[#20B2B8]/20">
          <MessageSquare size={16} className="text-[#20B2B8]" />
        </div>
        <div>
          <h2 className="text-lg text-[#FFF7F0] font-playfair">Send Us a Message</h2>
          <p className="text-[#FFF7F0]/25 text-xs mt-0.5">We&apos;d love to hear from you</p>
        </div>
      </div>

      <div className="w-full h-px bg-linear-to-r from-[#FFF7F0]/10 via-[#FFF7F0]/5 to-transparent mb-6" />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-14"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15">
                <CheckCircle2 size={36} className="text-emerald-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl text-[#FFF7F0] mt-5 mb-1.5 font-playfair">
              Message Sent!
            </h3>
            <p className="text-[#FFF7F0]/35 text-sm text-center max-w-xs">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFF7F0]/25 uppercase tracking-[0.2em] mb-1.5">
                <User size={10} /> Full Name <span className="text-[#20B2B8]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className={inputClass(!!error && !form.name.trim())}
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFF7F0]/25 uppercase tracking-[0.2em] mb-1.5">
                <Mail size={10} /> Email <span className="text-[#20B2B8]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={inputClass(!!error && !form.email.trim())}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFF7F0]/25 uppercase tracking-[0.2em] mb-1.5">
                <Phone size={10} /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number (Optional)"
                className={inputClass(false)}
              />
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#FFF7F0]/25 uppercase tracking-[0.2em] mb-1.5">
                <MessageSquare size={10} /> Message <span className="text-[#20B2B8]">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Enter your message here..."
                className={`${inputClass(!!error && !form.message.trim())} resize-none`}
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border ${
                    apiDown
                      ? "bg-[#D81B60]/5 border-[#D81B60]/20"
                      : "bg-red-500/10 border-red-500/20"
                  }`}
                >
                  {apiDown ? (
                    <AlertCircle size={16} className="text-[#D81B60] shrink-0 mt-0.5" />
                  ) : (
                    <X size={14} className="text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${apiDown ? "text-[#D81B60]" : "text-red-300"}`}>
                      {error}
                    </p>
                    {apiDown && (
                      <p className="text-[11px] text-[#FFF7F0]/20 mt-1">
                        Call us: <span className="text-[#D81B60]">+12269325002</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex cursor-pointer items-center justify-center gap-2.5 px-6 py-3.5 bg-linear-to-r from-[#20B2B8] to-[#F2673A] hover:brightness-110 text-white text-sm font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[#20B2B8]/30"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message <ArrowRight size={14} className="opacity-70" />
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-[#FFF7F0]/15 mt-2">
              By submitting, you agree to our privacy policy.
            </p>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}