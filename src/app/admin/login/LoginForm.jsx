// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import {
//   Eye,
//   EyeOff,
//   Loader2,
//   ShieldCheck,
//   ArrowRight,
//   X,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { loginAdmin } from "@/lib/auth/api";
// import { setStoredUser } from "@/lib/auth";

// export default function LoginForm() {
//   const searchParams = useSearchParams();
//   const redirectPath = searchParams.get("redirect") || "/admin/dashboard";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Email and password are required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const data = await loginAdmin(email, password);

//       if (data?.user) {
//         setStoredUser(data.user);
//       } else {
//         setStoredUser({
//           name: data?.name || "Admin",
//           email: data?.email || email,
//           role: data?.role || "admin",
//         });
//       }

//       document.cookie = "admin_token=authenticated; path=/; max-age=86400; SameSite=Lax";
//       window.location.href = redirectPath;
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearFields = () => {
//     setEmail("");
//     setPassword("");
//     setError("");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full"
//     >
//       {/* Background Glow */}
//       <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#2B7FFF]/10 rounded-full blur-3xl pointer-events-none" />

//       {/* Card */}
//       <div className="relative bg-[#1b3454] backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-8 sm:px-10 sm:py-10 shadow-2xl shadow-black/40">

//         {/* Title — Logo hata diya, ab directly title */}
//         <div className="flex items-center justify-center gap-3 mb-7">
//           <div className="w-10 h-10 rounded-xl bg-[#2B7FFF]/20 flex items-center justify-center border border-[#2B7FFF]/25 shrink-0">
//             <ShieldCheck size={20} className="text-[#2B7FFF]" />
//           </div>
//           <div>
//             <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
//               Admin Panel
//             </h1>
//             <p className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.2em]">
//               Secure Access
//             </p>
//           </div>
//         </div>

//         {/* Error */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-5 px-4 py-3 bg-red-500/15 border border-red-500/25 rounded-xl"
//           >
//             <p className="text-red-300 text-sm">{error}</p>
//           </motion.div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="admin@example.com"
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
//                 autoComplete="email"
//               />
//               {email && (
//                 <button
//                   type="button"
//                   onClick={() => setEmail("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
//                 >
//                   <X size={14} className="text-white/30 hover:text-white/60" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
//                 autoComplete="current-password"
//               />
//               {password && (
//                 <button
//                   type="button"
//                   onClick={() => setPassword("")}
//                   className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
//                 >
//                   <X size={14} className="text-white/30 hover:text-white/60" />
//                 </button>
//               )}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
//               >
//                 {showPassword ? (
//                   <EyeOff size={16} className="text-white/30" />
//                 ) : (
//                   <Eye size={16} className="text-white/30" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Buttons — Fixed alignment */}
//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={clearFields}
//               className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white/50 text-sm font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors flex-1"
//             >
//               <X size={14} />
//               Clear
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 flex items-center justify-center gap-2 bg-[#2B7FFF] hover:bg-[#4D94FF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-lg shadow-[#2B7FFF]/20 hover:shadow-[#2B7FFF]/30"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" />
//                   Logging...
//                 </>
//               ) : (
//                 <>
//                   Login
//                   <ArrowRight size={16} />
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-white/20 text-[11px] sm:text-xs mt-7">
//           Protected area — Unauthorized access is prohibited.
//         </p>
//       </div>
//     </motion.div>
//   );
// }











// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import {
//   Eye,
//   EyeOff,
//   Loader2,
//   ShieldCheck,
//   ArrowRight,
//   X,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { loginAdmin } from "@/lib/auth/api";
// import { setStoredUser } from "@/lib/auth";

// export default function LoginForm() {
//   const searchParams = useSearchParams();
//   const redirectPath = searchParams.get("redirect") || "/admin/dashboard";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Email and password are required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const data = await loginAdmin(email, password);

//       if (data?.user) {
//         setStoredUser(data.user);
//       } else {
//         setStoredUser({
//           name: data?.name || "Admin",
//           email: data?.email || email,
//           role: data?.role || "admin",
//         });
//       }

//       document.cookie = "admin_token=authenticated; path=/; max-age=86400; SameSite=Lax";
//       window.location.href = redirectPath;
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearFields = () => {
//     setEmail("");
//     setPassword("");
//     setError("");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full"
//     >
//       {/* Background Glow */}
//       <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FAAE62]/10 rounded-full blur-3xl pointer-events-none" />

//       {/* Card */}
//       <div className="relative bg-[#4a1d60] backdrop-blur-xl rounded-2xl border border-white/10 px-6 py-8 sm:px-10 sm:py-10 shadow-2xl shadow-black/40">

//         {/* Title */}
//         <div className="flex items-center justify-center gap-3 mb-7">
//           <div className="w-10 h-10 rounded-xl bg-[#FAAE62]/20 flex items-center justify-center border border-[#FAAE62]/25 shrink-0">
//             <ShieldCheck size={20} className="text-[#FAAE62]" />
//           </div>
//           <div>
//             <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
//               Admin Panel
//             </h1>
//             <p className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.2em]">
//               Secure Access
//             </p>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="flex items-center gap-3 mb-6">
//           <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
//         </div>

//         {/* Error */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-5 px-4 py-3 bg-red-500/15 border border-red-500/25 rounded-xl"
//           >
//             <p className="text-red-300 text-sm">{error}</p>
//           </motion.div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="admin@example.com"
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#FAAE62]/40 focus:ring-2 focus:ring-[#FAAE62]/10 transition-all"
//                 autoComplete="email"
//               />
//               {email && (
//                 <button
//                   type="button"
//                   onClick={() => setEmail("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
//                 >
//                   <X size={14} className="text-white/30 hover:text-white/60" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#FAAE62]/40 focus:ring-2 focus:ring-[#FAAE62]/10 transition-all"
//                 autoComplete="current-password"
//               />
//               {password && (
//                 <button
//                   type="button"
//                   onClick={() => setPassword("")}
//                   className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
//                 >
//                   <X size={14} className="text-white/30 hover:text-white/60" />
//                 </button>
//               )}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
//               >
//                 {showPassword ? (
//                   <EyeOff size={16} className="text-white/30" />
//                 ) : (
//                   <Eye size={16} className="text-white/30" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={clearFields}
//               className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white/50 text-sm font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors flex-1 cursor-pointer"
//             >
//               <X size={14} />
//               Clear
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 flex items-center justify-center gap-2 bg-[#FAAE62] hover:bg-[#ffc87a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FAAE62]/20 hover:shadow-[#FAAE62]/30"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={16} className="animate-spin" />
//                   Logging...
//                 </>
//               ) : (
//                 <>
//                   Login
//                   <ArrowRight size={16} />
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-white/20 text-[11px] sm:text-xs mt-7">
//           Protected area — Unauthorized access is prohibited.
//         </p>
//       </div>
//     </motion.div>
//   );
// }











"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // Added Link import
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  X,
  Home, // Added Home icon
} from "lucide-react";
import { motion } from "framer-motion";
import { loginAdmin } from "@/lib/auth/api";
import { setStoredUser } from "@/lib/auth";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const data = await loginAdmin(email, password);

      if (data?.user) {
        setStoredUser(data.user);
      } else {
        setStoredUser({
          name: data?.name || "Admin",
          email: data?.email || email,
          role: data?.role || "admin",
        });
      }

      document.cookie = "admin_token=authenticated; path=/; max-age=86400; SameSite=Lax";
      window.location.href = redirectPath;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Background Glow - Turquoise */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#20B2B8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card - Navy Card Background */}
      <div className="relative bg-[#1E3040] backdrop-blur-xl rounded-2xl border border-[#FFF7F0]/10 px-6 py-8 sm:px-10 sm:py-10 shadow-2xl shadow-black/40">

        {/* Title */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl bg-[#20B2B8]/20 flex items-center justify-center border border-[#20B2B8]/25 shrink-0">
            <ShieldCheck size={20} className="text-[#20B2B8]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#FFF7F0] leading-tight">
              Admin Panel
            </h1>
            <p className="text-[10px] sm:text-[11px] text-[#FFF7F0]/40 uppercase tracking-[0.2em]">
              Secure Access
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#FFF7F0]/10 to-transparent" />
        </div>

        {/* Error - Using Dark Pink for error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 px-4 py-3 bg-[#D81B60]/15 border border-[#D81B60]/25 rounded-xl"
          >
            <p className="text-[#D81B60] text-sm">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-[#FFF7F0]/40 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-[#FFF7F0]/5 border border-[#FFF7F0]/10 rounded-xl px-4 py-3 pr-10 text-sm text-[#FFF7F0] placeholder:text-[#FFF7F0]/25 outline-none focus:border-[#20B2B8]/40 focus:ring-2 focus:ring-[#20B2B8]/10 transition-all"
                autoComplete="email"
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#FFF7F0]/10 transition-colors"
                >
                  <X size={14} className="text-[#FFF7F0]/30 hover:text-[#FFF7F0]/60" />
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-[#FFF7F0]/40 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#FFF7F0]/5 border border-[#FFF7F0]/10 rounded-xl px-4 py-3 pr-20 text-sm text-[#FFF7F0] placeholder:text-[#FFF7F0]/25 outline-none focus:border-[#20B2B8]/40 focus:ring-2 focus:ring-[#20B2B8]/10 transition-all"
                autoComplete="current-password"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setPassword("")}
                  className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#FFF7F0]/10 transition-colors"
                >
                  <X size={14} className="text-[#FFF7F0]/30 hover:text-[#FFF7F0]/60" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FFF7F0]/5 transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-[#FFF7F0]/30" />
                ) : (
                  <Eye size={16} className="text-[#FFF7F0]/30" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={clearFields}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FFF7F0]/5 border border-[#FFF7F0]/10 text-[#FFF7F0]/50 text-sm font-medium rounded-xl hover:bg-[#FFF7F0]/10 hover:border-[#FFF7F0]/20 transition-colors flex-1 cursor-pointer"
            >
              <X size={14} />
              Clear
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-[#20B2B8] to-[#F2673A] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#20B2B8]/20"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Logging...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Home Navigation Button */}
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-[#FFF7F0]/10 text-[#FFF7F0]/60 text-sm font-medium rounded-xl hover:bg-[#FFF7F0]/5 hover:border-[#FFF7F0]/20 hover:text-[#FFF7F0]/80 transition-all cursor-pointer"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-[#FFF7F0]/20 text-[11px] sm:text-xs mt-7">
          Protected area — Unauthorized access is prohibited.
        </p>
      </div>
    </motion.div>
  );
}