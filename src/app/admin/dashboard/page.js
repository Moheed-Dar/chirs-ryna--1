"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth/api";
import { getStoredUser, clearStoredUser } from "@/lib/auth";
import { getAllProperties } from "@/lib/properties/api";
import { getAllLeads } from "@/lib/leads/api";
import { getAllContacts } from "@/lib/contact/api";
import { getAllBlogs } from "@/lib/blogs/api";
import {
  LogOut,
  Users,
  Building2,
  Loader2,
  ShieldCheck,
  MessageSquare,
  Menu,
  X,
  LayoutDashboard,
  RefreshCw,
  Newspaper,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

// ============================================
// LAZY LOAD THE PAGE COMPONENTS
// ============================================
const PropertiesPage = lazy(
  () => import("@/app/admin/dashboard/properties/page"),
);
const LeadsPage = lazy(() => import("@/app/admin/dashboard/leads/page"));
const ContactsPage = lazy(() => import("@/app/admin/dashboard/contacts/page"));
const BlogsPage = lazy(() => import("@/app/admin/dashboard/blogs/page"));

// ============================================
// TAB CONFIG
// ============================================
const TABS = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard, component: null },
  {
    id: "properties",
    label: "Properties",
    icon: Building2,
    component: PropertiesPage,
  },
  { id: "leads", label: "Leads", icon: Users, component: LeadsPage },
  {
    id: "contacts",
    label: "Contacts",
    icon: MessageSquare,
    component: ContactsPage,
  },
  {
    id: "blogs",
    label: "Blogs",
    icon: Newspaper,
    component: BlogsPage,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // ---- Stats State ----
  const [stats, setStats] = useState({
    properties: 0,
    leads: 0,
    contacts: 0,
    blogs: 0,
  });

  // ---- Refresh State ----
  const [refreshing, setRefreshing] = useState(false);

  // ---- Auth check ----
  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.replace("/admin/login");
      return;
    }
    setUser(storedUser);
    setLoading(false);
  }, [router]);

  // ---- Fetch Stats ----
  const fetchStats = useCallback(async () => {
    try {
      const [propRes, leadRes, contactRes, blogRes] = await Promise.all([
        getAllProperties(1, 1),
        getAllLeads(1, 1),
        getAllContacts(1, 1),
        getAllBlogs({ page: 1, limit: 1 }), // ✅ Fixed: passing object as expected by API function
      ]);

      setStats({
        properties: propRes?.totalCount || propRes?.total || 0,
        leads: leadRes?.totalCount || leadRes?.total || 0,
        contacts: contactRes?.totalCount || contactRes?.total || 0,
        blogs: blogRes?.totalBlogs || blogRes?.totalCount || blogRes?.total || 0, // ✅ Fixed: checking for 'totalBlogs'
      });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  // ---- Refresh Handler ----
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logoutAdmin();
    } catch {
      // API fail bhi toh local clean karo
    }
    clearStoredUser();
    document.cookie = "admin_token=; path=/; max-age=0";
    window.location.href = "/admin/login";
  }, []);

  // ---- Get active component ----
  const activeTabData = TABS.find((t) => t.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  // ---- Dynamic Stats Config ----
  const DYNAMIC_STATS = [
    {
      label: "Total Properties",
      value: stats.properties,
      icon: Building2,
      color: "#2B7FFF",
      bg: "rgba(43,127,255,0.1)",
      border: "rgba(43,127,255,0.2)",
    },
    {
      label: "Total Leads",
      value: stats.leads,
      icon: Users,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
    },
    {
      label: "Total Contacts",
      value: stats.contacts,
      icon: MessageSquare,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      border: "rgba(139,92,246,0.2)",
    },
    {
      label: "Total Blogs",
      value: stats.blogs,
      icon: Newspaper,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
    },
  ];

  // ---- Sidebar Bottom — User Info + Logout ----
  const SidebarBottom = ({ onAction }) => (
    <div className="border-t border-white/10 pt-4 px-3 pb-2">
      {/* User Info */}
      <div className="px-3 py-2 mb-3">
        <p className="text-white text-sm font-semibold truncate">
          {user?.name || "Admin"}
        </p>
        <p className="text-white/40 text-xs truncate mt-0.5">
          {user?.email || "admin@example.com"}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loggingOut ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        {loggingOut ? "Signing out..." : "Logout"}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#13273f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-[#2B7FFF]/60" />
          <p className="text-white/40 text-sm tracking-wider uppercase">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#13273f] flex ${inter.variable} font-(family-name:--font-inter) relative overflow-hidden`}
    >
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1b3454]/95 backdrop-blur-sm border-r border-white/10 shrink-0 relative z-10">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/20 flex items-center justify-center border border-[#2B7FFF]/25">
            <ShieldCheck size={16} className="text-[#2B7FFF]" />
          </div>
          <span
            className={`text-white font-bold text-sm ${playfair.variable} font-(family-name:--font-playfair)`}
          >
            Admin Panel
          </span>
        </div>

        {/* Nav Tabs */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/25"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <SidebarBottom />

        {/* Version */}
        <div className="p-4 pt-2">
          <div className="text-[10px] text-white/20 text-center">
            v1.0 • Admin Panel
          </div>
        </div>
      </aside>

      {/* ===== MOBILE SIDEBAR ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#1b3454] border-r border-white/10 z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/20 flex items-center justify-center border border-[#2B7FFF]/25">
                    <ShieldCheck size={16} className="text-[#2B7FFF]" />
                  </div>
                  <span className="text-white font-bold text-sm">Admin</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <X size={18} className="text-white/50" />
                </button>
              </div>

              {/* Nav Tabs */}
              <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/25"
                          : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* User Info + Logout */}
              <SidebarBottom onAction={() => setSidebarOpen(false)} />

              {/* Version */}
              <div className="p-4 pt-2">
                <div className="text-[10px] text-white/20 text-center">
                  v1.0 • Admin Panel
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Bar */}
        <header className="h-16 bg-[#1b3454]/95 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <Menu size={20} className="text-white/50" />
            </button>
            <h2 className="text-white font-semibold text-sm hidden sm:block">
              {TABS.find((t) => t.id === activeTab)?.label || "Dashboard"}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === "home" ? (
            <>
              {/* Welcome Text */}
              <div className="mb-8">
                <h1
                  className={`text-2xl sm:text-3xl font-bold text-white mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
                >
                  Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                </h1>
                <p className="text-white/40 text-sm">
                  Here&apos;s what&apos;s happening with your platform today.
                </p>
              </div>

              {/* ===== 4 STATS CARDS ===== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {DYNAMIC_STATS.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="relative bg-[#1b3454]/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                      {/* Hover Glow */}
                      <div
                        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ background: stat.bg }}
                      />

                      <div className="relative flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: stat.bg,
                            border: `1px solid ${stat.border}`,
                          }}
                        >
                          <Icon size={22} style={{ color: stat.color }} />
                        </div>
                      </div>

                      <p className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-white/40 text-sm font-medium">
                        {stat.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* ===== REFRESH BUTTON ===== */}
              <div className="mt-5">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    size={15}
                    className={`transition-transform duration-500 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh Stats"}
                </button>
              </div>
            </>
          ) : (
            /* ---- OTHER TABS (Properties, Leads, Contacts, Blogs) ---- */
            <div className="bg-[#1b3454]/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 min-h-[calc(100vh-8rem)]">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <Loader2
                      size={28}
                      className="animate-spin text-[#2B7FFF]/50"
                    />
                  </div>
                }
              >
                {ActiveComponent && <ActiveComponent />}
              </Suspense>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}