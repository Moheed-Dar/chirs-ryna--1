"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  LinkIcon,
  BookOpen,
  Loader2,
  ChevronRight,
  Eye,
  Share2,
  Gem,
  X,
  CheckCircle2,
  Hash,
  Home,
} from "lucide-react";
import { getBlogById, getAllBlogs } from "@/lib/blogs/api";

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

// ==========================================
// ✅ SAFE IMAGE HELPER
// ==========================================
const getSafeImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

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

// ==========================================
// ✅ CUSTOM SOCIAL SVG ICONS
// ==========================================
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 22.267.792 23 1.771 23h20.451C23.208 23 24 22.267 24 21.271V1.729C24 .774 23.208 0 22.222 0h.003z" />
  </svg>
);

// ==========================================
// ✅ TOAST
// ==========================================
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium text-white animate-slide-up"
      style={{
        background: `linear-gradient(135deg, ${TEAL}, ${BRIGHT_CYAN})`,
        boxShadow: `0 4px 16px ${TEAL}40`,
      }}
    >
      ✓ {message}
    </div>
  );
};

// ==========================================
// ✅ MAIN BLOG DETAIL PAGE
// ==========================================
export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (msg) => setToast({ message: msg, visible: true });
  const hideToast = () => setToast({ message: "", visible: false });

  // ==========================================
  // ✅ FETCH BLOG BY ID
  // ==========================================
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlogById(id);
        setBlog(res?.data || res);
      } catch (err) {
        setError(err.message || "Blog not found or removed");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // ==========================================
  // ✅ FETCH RECENT BLOGS
  // ==========================================
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getAllBlogs({
          limit: 4,
          status: "published",
          sortBy: "createdAt",
          order: "desc",
        });

        if (data.success) {
          const filtered = (data.data || []).filter((b) => b._id !== id);
          setRecentBlogs(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Fetch recent blogs error:", err);
      }
    };

    if (id) fetchRecent();
  }, [id]);

  // ==========================================
  // ✅ TRIGGER ANIMATIONS
  // ==========================================
  useEffect(() => {
    if (!blog || loading) return;
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, [blog, loading]);

  // ==========================================
  // ✅ SHARE
  // ==========================================
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog?.title || "Blog Post";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: blog?.title,
        text: `Check out: ${blog?.title}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard();
    }
  };

  // ==========================================
  // ✅ HELPERS
  // ==========================================
  const formatDateShort = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReadTime = (content) => {
    if (!content) return "1 min read";
    const plainText = content.replace(/<[^>]*>/g, "");
    const words = plainText.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const blogImageUrl = blog ? getSafeImage(blog.featuredImage) || blog.image || null : null;
  
  // Decode content to render actual HTML instead of string tags
  const decodedContent = blog ? decodeHtml(blog.content) : "";

  // ==========================================
  // ✅ LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: NAVY }}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div
              className="w-14 h-14 border-2 rounded-full animate-spin"
              style={{
                borderColor: `${TEAL}20`,
                borderTopColor: TEAL,
              }}
            />
            <Gem
              size={16}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ color: `${TEAL}60` }}
            />
          </div>
          <p className="text-sm tracking-[0.2em] uppercase" style={{ color: CREAM_40 }}>
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ✅ ERROR STATE
  // ==========================================
  if (error || !blog) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: NAVY }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: "rgba(177,241,233,0.05)",
            borderColor: "rgba(177,241,233,0.1)",
          }}
        >
          <X size={32} style={{ color: CREAM_40 }} />
        </div>
        <h2 className="text-xl font-bold text-white">Blog Not Found</h2>
        <p className="text-sm text-center max-w-sm" style={{ color: CREAM_50 }}>
          {error || "The blog you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          href="/blogs"
          className="mt-2 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
          style={{
            backgroundColor: `${TEAL}15`,
            backdropFilter: "blur(8px)",
            border: `1px solid ${TEAL}30`,
            color: TEAL,
          }}
        >
          <ArrowLeft size={16} /> Browse Blogs
        </Link>
      </div>
    );
  }

  // ==========================================
  // ✅ RENDER
  // ==========================================
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: NAVY }}>
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${TEAL} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
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

      {/* ============================== */}
      {/* ✅ HERO BANNER */}
      {/* ============================== */}
      <section className="relative z-10">
        <div className="relative w-full h-75 sm:h-100 lg:h-130 overflow-hidden">
          {blogImageUrl ? (
            <Image
              src={blogImageUrl}
              alt={blog.title || "Blog cover"}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(to bottom right, ${NAVY_LIGHT}, ${NAVY_DARK})`,
              }}
            />
          )}

          {/* TOP gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${NAVY}EE, ${NAVY}66, transparent)`,
            }}
          />

          {/* BOTTOM gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${NAVY}, ${NAVY}99, transparent)`,
            }}
          />

          {/* TITLE + META */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 sm:pb-10 lg:pb-12 px-4 sm:px-6">
            <div className="max-w-4xl w-full text-center">
              {/* Category Badge */}
              {blog.category && (
                <span
                  className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold rounded-full mb-4 sm:mb-5"
                  style={{
                    backgroundColor: `${BRIGHT_CYAN}20`,
                    color: MINT,
                    border: `1px solid ${BRIGHT_CYAN}40`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Tag size={11} style={{ color: BRIGHT_CYAN }} />
                  {blog.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.15] mb-4 sm:mb-5">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-5 sm:mb-6" style={{ color: CREAM_75 }}>
                  {blog.excerpt}
                </p>
              )}

              {/* Meta Row */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-5 sm:mb-6">
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                      style={{
                        backgroundColor: `${TEAL}15`,
                        border: `2px solid ${TEAL}25`,
                      }}
                    >
                      {blog.author.avatar ? (
                        <Image
                          src={blog.author.avatar}
                          alt={blog.author.name}
                          width={36}
                          height={36}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={14} style={{ color: `${TEAL}80` }} />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {blog.author.name}
                    </span>
                  </div>
                )}
                <span className="h-5 w-px" style={{ backgroundColor: `${MINT}20` }} />
                <span className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: CREAM_60 }}>
                  <Calendar size={13} style={{ color: `${TEAL}80` }} />
                  {formatDateShort(blog.createdAt)}
                </span>
                <span className="h-5 w-px" style={{ backgroundColor: `${MINT}20` }} />
                <span className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: CREAM_60 }}>
                  <Clock size={13} style={{ color: `${TEAL}80` }} />
                  {blog.readTime || getReadTime(blog.content)}
                </span>
                <span className="h-5 w-px" style={{ backgroundColor: `${MINT}20` }} />
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs sm:text-sm transition-colors"
                  style={{ color: CREAM_60 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_60)}
                >
                  <Share2 size={13} style={{ color: `${TEAL}80` }} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* ✅ BREADCRUMB */}
      {/* ============================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        <div
          className={`transition-opacity duration-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "30ms", transitionProperty: "opacity, transform" }}
        >
          <nav
            className="flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3"
            style={{
              backgroundColor: `${NAVY_CARD}CC`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${MINT}10`,
            }}
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium shrink-0 transition-colors"
              style={{ color: CREAM_50 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_50)}
            >
              <Home size={13} className="shrink-0" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <ChevronRight size={12} style={{ color: `${TEAL}40` }} className="shrink-0" />

            <Link
              href="/blogs"
              className="text-xs sm:text-sm font-medium shrink-0 transition-colors"
              style={{ color: CREAM_50 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_50)}
            >
              Blogs
            </Link>

            <ChevronRight size={12} style={{ color: `${TEAL}40` }} className="shrink-0" />

            {blog.category && (
              <>
                <Link
                  href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                  className="text-xs sm:text-sm font-medium shrink-0 transition-colors"
                  style={{ color: CREAM_50 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_50)}
                >
                  {blog.category}
                </Link>
                <ChevronRight size={12} style={{ color: `${TEAL}40` }} className="shrink-0" />
              </>
            )}

            <span className="text-xs sm:text-sm font-semibold truncate" style={{ color: TEAL }}>
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* 1️⃣ Headers */}
            {blog.headers && blog.headers.length > 0 && (
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "50ms", transitionProperty: "opacity, transform" }}
              >
                <div className="space-y-4 sm:space-y-5">
                  {blog.headers.map((header, index) => (
                    <div
                      key={index}
                      className="rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6"
                      style={{
                        backgroundColor: NAVY_CARD,
                        border: `1px solid ${MINT}10`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${TEAL}15`,
                            border: `1px solid ${TEAL}25`,
                          }}
                        >
                          <span className="text-[10px] sm:text-[11px] font-bold" style={{ color: TEAL }}>
                            {index + 1}
                          </span>
                        </div>
                        <h2
                          className={`font-semibold tracking-tight text-white ${
                            header.headerType === "h2"
                              ? "text-lg sm:text-xl lg:text-2xl"
                              : header.headerType === "h3"
                              ? "text-base sm:text-lg lg:text-xl"
                              : "text-sm sm:text-base lg:text-lg"
                          }`}
                        >
                          {header.title}
                        </h2>
                      </div>
                      {header.image && getSafeImage(header.image) && (
                        <div
                          className="relative w-full aspect-video rounded-xl overflow-hidden mb-4"
                          style={{
                            backgroundColor: NAVY_DARK,
                            boxShadow: `inset 0 0 0 1px ${MINT}10`,
                          }}
                        >
                          <Image
                            src={getSafeImage(header.image)}
                            alt={header.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            unoptimized
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `linear-gradient(to top, ${NAVY}40, transparent)`,
                            }}
                          />
                        </div>
                      )}
                      {header.description && (
                        <div
                          className="text-sm sm:text-[15px] leading-[1.9] text-[#B1F1E9BF]
                                     [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 
                                     [&_a]:text-[#019586] [&_b]:text-white [&_strong]:text-white"
                          dangerouslySetInnerHTML={{ __html: decodeHtml(header.description) }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2️⃣ Blog Content */}
            <div
              className={`transition-opacity duration-500 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "100ms", transitionProperty: "opacity, transform" }}
            >
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8"
                style={{
                  backgroundColor: NAVY_CARD,
                  border: `1px solid ${MINT}10`,
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-px"
                    style={{
                      background: `linear-gradient(to right, ${TEAL}, transparent)`,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: TEAL }}
                  >
                    Article
                  </span>
                </div>
                
                {/* ✅ FIXED DECODED HTML & CUSTOM STYLES FOR EDITOR OUTPUT */}
                <div
                  className="max-w-none max-h-[70vh] overflow-y-auto pr-2 text-[#B1F1E9BF] text-sm sm:text-[15px] leading-[1.9]
                             [&_p]:my-3 
                             [&_div]:my-3 
                             [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h1]:text-white
                             [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-white
                             [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_h3]:text-white
                             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                             [&_li]:ml-2 [&_li]:my-1
                             [&_blockquote]:border-l-4 [&_blockquote]:border-[#019586]/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#B1F1E999]
                             [&_a]:text-[#019586] [&_a]:underline
                             [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4"
                  style={{
                    scrollbarWidth: "thin", 
                    scrollbarColor: `${TEAL}50 transparent`,
                  }}
                  dangerouslySetInnerHTML={{ __html: decodedContent || "<p>No content available.</p>" }}
                />
              </div>
            </div>

            {/* 3️⃣ Key Points */}
            {blog.points && blog.points.length > 0 && (
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "150ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${MINT}10`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-8 h-px"
                      style={{
                        background: `linear-gradient(to right, ${TEAL}, transparent)`,
                    }}
                    />
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: TEAL }}
                    >
                      Key Highlights
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl text-white mb-4">Key Points</h3>

                  <div className="space-y-4">
                    {blog.points
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((point, index) => (
                        <div key={index} className="group">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{
                                backgroundColor: TEAL,
                                boxShadow: `0 2px 8px ${TEAL}30`,
                              }}
                            >
                              <span className="text-[10px] sm:text-xs font-bold text-white">
                                {index + 1}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base font-semibold text-white mb-1 leading-snug">
                                {point.title}
                              </h4>
                              {point.description && (
                                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: CREAM_60 }}>
                                  {point.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {index < blog.points.length - 1 && (
                            <div className="mt-4 pl-10 sm:pl-12">
                              <div
                                className="h-px"
                                style={{
                                  background: `linear-gradient(to right, ${TEAL}20, ${MINT}10, ${TEAL}20)`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4️⃣ Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "200ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${MINT}10`,
                  }}
                >
                  <h3 className="text-lg sm:text-xl text-white mb-1">Tags</h3>
                  <div
                    className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
                    style={{
                      background: `linear-gradient(to right, ${TEAL}, transparent)`,
                    }}
                  />
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {blog.tags.map((tag, i) => (
                      <Link
                        key={i}
                        href={`/blogs?search=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 transition-colors group"
                        style={{
                          color: CREAM_75,
                          backgroundColor: `${MINT}08`,
                          border: `1px solid ${MINT}10`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${TEAL}15`;
                          e.currentTarget.style.borderColor = `${TEAL}30`;
                          e.currentTarget.style.color = MINT;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${MINT}08`;
                          e.currentTarget.style.borderColor = `${MINT}10`;
                          e.currentTarget.style.color = CREAM_75;
                        }}
                      >
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${TEAL}15` }}
                        >
                          <Hash size={9} style={{ color: `${TEAL}80` }} />
                        </div>
                        <span className="capitalize">{tag}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5️⃣ Share */}
            <div
              className={`transition-opacity duration-500 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "250ms", transitionProperty: "opacity, transform" }}
            >
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                style={{
                  backgroundColor: NAVY_CARD,
                  border: `1px solid ${MINT}10`,
                }}
              >
                <h3 className="text-lg sm:text-xl text-white mb-1">Share This Article</h3>
                <div
                  className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
                  style={{
                    background: `linear-gradient(to right, ${TEAL}, transparent)`,
                  }}
                />
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `${TEAL}15`,
                      color: TEAL,
                      border: `1px solid ${TEAL}25`,
                    }}
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `${MINT}08`,
                      color: CREAM_80,
                      border: `1px solid ${MINT}12`,
                    }}
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `${BRIGHT_CYAN}15`,
                      color: BRIGHT_CYAN,
                      border: `1px solid ${BRIGHT_CYAN}25`,
                    }}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `${MINT}15`,
                      color: MINT,
                      border: `1px solid ${MINT}25`,
                    }}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
              {/* Author */}
              {blog.author && (
                <div
                  className={`transition-opacity duration-500 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "300ms", transitionProperty: "opacity, transform" }}
                >
                  <div
                    className="rounded-xl sm:rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: NAVY_CARD,
                      border: `1px solid ${MINT}10`,
                    }}
                  >
                    <div
                      className="px-4 sm:px-5 lg:px-6 py-4 sm:py-5"
                      style={{
                        background: `linear-gradient(to right, ${TEAL}12, ${TEAL}06, transparent)`,
                        borderBottom: `1px solid ${MINT}10`,
                      }}
                    >
                      <h4
                        className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3"
                        style={{ color: CREAM_50 }}
                      >
                        About the Author
                      </h4>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                          style={{
                            backgroundColor: `${TEAL}15`,
                            border: `2px solid ${TEAL}25`,
                            boxShadow: `0 4px 12px ${TEAL}20`,
                          }}
                        >
                          {blog.author.avatar ? (
                            <Image
                              src={blog.author.avatar}
                              alt={blog.author.name}
                              width={48}
                              height={48}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User size={18} style={{ color: `${TEAL}80` }} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">
                            {blog.author.name}
                          </p>
                          {blog.author.email && (
                            <p className="text-[11px] sm:text-xs truncate" style={{ color: CREAM_50 }}>
                              {blog.author.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: CREAM_60 }}>
                        Contributing writer sharing insights and expertise on{" "}
                        <span className="font-medium" style={{ color: `${TEAL}CC` }}>
                          {blog.category || "various topics"}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "350ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${MINT}10`,
                  }}
                >
                  <h4
                    className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3"
                    style={{ color: CREAM_50 }}
                  >
                    Article Info
                  </h4>
                  <div className="space-y-0">
                    <div
                      className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                      style={{ borderBottom: `1px solid ${MINT}10` }}
                    >
                      <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                        <Calendar size={11} style={{ color: `${TEAL}60` }} />Published
                      </span>
                      <span className="font-semibold text-white">{formatDateShort(blog.createdAt)}</span>
                    </div>
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <div
                        className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                        style={{ borderBottom: `1px solid ${MINT}10` }}
                      >
                        <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                          <Clock size={11} style={{ color: `${TEAL}60` }} />Updated
                        </span>
                        <span className="font-semibold text-white">{formatDateShort(blog.updatedAt)}</span>
                      </div>
                    )}
                    <div
                      className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                      style={{ borderBottom: `1px solid ${MINT}10` }}
                    >
                      <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                        <Clock size={11} style={{ color: `${TEAL}60` }} />Read Time
                      </span>
                      <span className="font-semibold text-white">{blog.readTime || getReadTime(blog.content)}</span>
                    </div>
                    {blog.viewsCount > 0 && (
                      <div
                        className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                        style={{ borderBottom: `1px solid ${MINT}10` }}
                      >
                        <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                          <Eye size={11} style={{ color: `${TEAL}60` }} />Views
                        </span>
                        <span className="font-semibold text-white">{blog.viewsCount}</span>
                      </div>
                    )}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
                        <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                          <Hash size={11} style={{ color: `${TEAL}60` }} />Tags
                        </span>
                        <span className="font-semibold text-white">{blog.tags.length} tags</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags Cloud */}
              {blog.tags && blog.tags.length > 0 && (
                <div
                  className={`transition-opacity duration-500 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "400ms", transitionProperty: "opacity, transform" }}
                >
                  <div
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                    style={{
                      backgroundColor: NAVY_CARD,
                      border: `1px solid ${MINT}10`,
                    }}
                  >
                    <h4
                      className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3"
                      style={{ color: CREAM_50 }}
                    >
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {blog.tags.map((tag, i) => (
                        <Link
                          key={i}
                          href={`/blogs?search=${encodeURIComponent(tag)}`}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-full transition-colors"
                          style={{
                            color: CREAM_60,
                            backgroundColor: `${MINT}08`,
                            border: `1px solid ${MINT}10`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${TEAL}15`;
                            e.currentTarget.style.borderColor = `${TEAL}30`;
                            e.currentTarget.style.color = TEAL;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = `${MINT}08`;
                            e.currentTarget.style.borderColor = `${MINT}10`;
                            e.currentTarget.style.color = CREAM_60;
                          }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Blogs */}
              {recentBlogs.length > 0 && (
                <div
                  className={`transition-opacity duration-500 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "450ms", transitionProperty: "opacity, transform" }}
                >
                  <div
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                    style={{
                      backgroundColor: NAVY_CARD,
                      border: `1px solid ${MINT}10`,
                    }}
                  >
                    <h4
                      className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4"
                      style={{ color: CREAM_50 }}
                    >
                      Recent Blogs
                    </h4>
                    <div className="space-y-3">
                      {recentBlogs.map((recent) => {
                        const recImg = getSafeImage(recent.featuredImage) || recent.image || null;
                        return (
                          <Link key={recent._id} href={`/blogs/${recent._id}`} className="group block">
                            <div className="flex gap-3">
                              <div
                                className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden"
                                style={{
                                  backgroundColor: NAVY_DARK,
                                  border: `1px solid ${MINT}10`,
                                }}
                              >
                                {recImg ? (
                                  <Image
                                    src={recImg}
                                    alt={recent.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="64px"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <BookOpen size={16} style={{ color: CREAM_30 }} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className="text-[11px] sm:text-xs font-bold line-clamp-2 transition-colors"
                                  style={{ color: CREAM_80 }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_80)}
                                >
                                  {recent.title}
                                </h5>
                                <p
                                  className="text-[10px] sm:text-[11px] mt-1 flex items-center gap-1"
                                  style={{ color: CREAM_40 }}
                                >
                                  <Calendar size={9} style={{ color: `${TEAL}50` }} />
                                  {formatDateShort(recent.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Verified */}
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "500ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid ${MINT}10`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${TEAL}15`,
                      border: `1px solid ${TEAL}30`,
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: TEAL }} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Verified Content
                    </p>
                    <p className="text-[11px] sm:text-xs" style={{ color: CREAM_50 }}>
                      This article is fact-checked and reviewed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}