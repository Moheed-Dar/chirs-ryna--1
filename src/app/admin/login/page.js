// import Link from "next/link";
// import LoginForm from "@/app/admin/login/LoginForm";

// // ✅ YEH LINE ADD KARO — Vercel ko pre-render karne se rokega
// export const dynamic = 'force-dynamic';

// export const metadata = {
//   title: "Admin Login",
//   description: "Login to admin panel",
// };

// export default function AdminLoginPage() {
//   return (
//     <div className="relative h-screen w-screen flex items-center justify-center bg-[#0a1929] overflow-hidden">
//       {/* Background Grid */}
//       <div
//         className="absolute inset-0 opacity-[0.03] pointer-events-none"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />

//       {/* ===== LOGO WATERMARK ===== */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
//         <img
//           src="/images/logo.png"
//           alt="Logo Watermark"
//           width={400}
//           height={400}
//           style={{ width: "auto", height: "auto" }}
//           className="w-125 h-125 sm:w-150 sm:h-150 object-contain opacity-[0.04]"
//         />
//       </div>

//       {/* Top Glow */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-[#2B7FFF]/8 rounded-full blur-[120px] pointer-events-none z-0" />

//       {/* Bottom Glow */}
//       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-62.5 bg-[#2B7FFF]/5 rounded-full blur-[100px] pointer-events-none z-0" />

//       {/* Back to Home — Fixed Position */}
//       <Link
//         href="/"
//         className="fixed top-5 left-5 z-50 flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-all bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="m15 18-6-6 6-6" />
//         </svg>
//         <span className="hidden sm:inline">Back to Home</span>
//       </Link>

//       {/* Form Container — Constrained Width */}
//       <div className="relative z-10 w-full max-w-105 mx-4">
//         <LoginForm />
//       </div>
//     </div>
//   );
// }













// import Link from "next/link";
// import LoginForm from "@/app/admin/login/LoginForm";

// export const dynamic = 'force-dynamic';

// export const metadata = {
//   title: "Admin Login",
//   description: "Login to admin panel",
// };

// export default function AdminLoginPage() {
//   return (
//     <div className="relative h-screen w-screen flex items-center justify-center bg-[#1F2D3D] overflow-hidden">
//       {/* Background Grid - using Cream */}
//       <div
//         className="absolute inset-0 opacity-[0.03] pointer-events-none"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(255,247,240,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,247,240,0.1) 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />

//       {/* ===== LOGO WATERMARK ===== */}
//       <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
//         <img
//           src="/images/solidlogo11.png"
//           alt="Logo Watermark"
//           width={400}
//           height={400}
//           style={{ width: "auto", height: "auto" }}
//           className="w-125 h-125 sm:w-150 sm:h-150 object-contain opacity-[0.3]"
//         />
//       </div>

//       {/* Top Glow - Turquoise */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-[#20B2B8]/8 rounded-full blur-[120px] pointer-events-none z-0" />

//       {/* Bottom Glow - Dark Pink */}
//       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-62.5 bg-[#D81B60]/5 rounded-full blur-[100px] pointer-events-none z-0" />

//       {/* Back to Home */}
//       <Link
//         href="/"
//         className="fixed top-5 left-5 z-50 flex items-center gap-2 text-[#FFF7F0]/50 hover:text-[#FFF7F0]/80 text-sm font-medium transition-all bg-[#FFF7F0]/5 hover:bg-[#FFF7F0]/10 px-4 py-2.5 rounded-xl border border-[#FFF7F0]/10 hover:border-[#FFF7F0]/20"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="m15 18-6-6 6-6" />
//         </svg>
//         <span className="hidden sm:inline">Back to Home</span>
//       </Link>

//       {/* Form Container */}
//       <div className="relative z-10 w-full max-w-105 mx-4">
//         <LoginForm />
//       </div>
//     </div>
//   );
// }












import Link from "next/link";
import LoginForm from "@/app/admin/login/LoginForm";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin Login",
  description: "Login to admin panel",
};

export default function AdminLoginPage() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-[#014D41] overflow-hidden">
      {/* Background Grid - using Mint (#B1F1E9) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(177,241,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(177,241,233,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ===== LOGO WATERMARK ===== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/images/solidlogo11.png"
          alt="Logo Watermark"
          width={400}
          height={400}
          style={{ width: "auto", height: "auto" }}
          className="w-125 h-125 sm:w-150 sm:h-150 object-contain opacity-[0.3]"
        />
      </div>

      {/* Top Glow - Teal (#019586) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-[#019586]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Bottom Glow - Green (#00B777) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-62.5 bg-[#00B777]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 text-[#B1F1E9]/60 hover:text-[#B1F1E9] text-sm font-medium transition-all bg-[#B1F1E9]/5 hover:bg-[#B1F1E9]/10 px-4 py-2.5 rounded-xl border border-[#B1F1E9]/15 hover:border-[#B1F1E9]/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-105 mx-4">
        <LoginForm />
      </div>
    </div>
  );
}