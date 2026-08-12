"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogs } from "@/lib/blogs/api";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Tag,
  ArrowRight,
  BookOpen,
  Loader2,
  X,
} from "lucide-react";

// ==========================================
// ✅ COLOR PALETTE
// ==========================================
const TURQUOISE = "#20B2B8";
const LIGHT_AQUA = "#BEEBF0";
const DARK_PINK = "#D81B60";
const DARK_ORANGE = "#F2673A";
const PEACH = "#FFC8B5";
const DARK_TEAL = "#0D1F22";

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
// ✅ BLOG CARD
// ==========================================
const BlogCard = ({ blog }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const imageUrl = getSafeImage(blog.featuredImage) || blog.image || null;

  const preview =
    blog.excerpt ||
    (blog.content ? stripHtml(blog.content).slice(0, 120) + "..." : null) ||
    "No preview available";

  return (
    <Link href={`/blogs/${blog._id}`} className="group block">
      <article
        className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        style={{
          border: "1px solid rgba(32,178,184,0.1)",
          boxShadow: "0 2px 12px rgba(32,178,184,0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(32,178,184,0.25)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(32,178,184,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(32,178,184,0.1)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(32,178,184,0.04)";
        }}
      >
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog.title || "Blog image"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className="flex items-center justify-center h-full"
              style={{
                background: `linear-gradient(to bottom right, ${LIGHT_AQUA}20, ${TURQUOISE}10)`,
              }}
            >
              <BookOpen className="w-12 h-12" style={{ color: `${TURQUOISE}60` }} />
            </div>
          )}

          {blog.category && (
            <span
              className="absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide z-10"
              style={{
                background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
              }}
            >
              {blog.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(blog.createdAt)}
            </span>
            {blog.author?.name && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {blog.author.name}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 transition-colors duration-200"
            style={{ color: "#1F2D3D" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = TURQUOISE)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1F2D3D")}
          >
            {blog.title}
          </h3>

          {/* Preview */}
          <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {preview}
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {blog.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md"
                  style={{
                    color: TURQUOISE,
                    backgroundColor: `${TURQUOISE}10`,
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-slate-400 px-1 py-0.5">
                  +{blog.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Read More */}
          <div
            className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all duration-200"
            style={{ color: TURQUOISE }}
          >
            Read More
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </article>
    </Link>
  );
};

// ==========================================
// ✅ CATEGORY BUTTON
// ==========================================
const CategoryButton = ({ category, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
    style={
      isActive
        ? {
            background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
            color: "#ffffff",
            boxShadow: `0 2px 8px ${TURQUOISE}30`,
          }
        : {
            backgroundColor: "#ffffff",
            color: "#64748b",
            border: "1px solid #e2e8f0",
          }
    }
    onMouseEnter={(e) => {
      if (!isActive) {
        e.currentTarget.style.borderColor = TURQUOISE;
        e.currentTarget.style.color = TURQUOISE;
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.color = "#64748b";
      }
    }}
  >
    {category}
    {count > 0 && (
      <span
        className="ml-1.5 text-xs"
        style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#94a3b8" }}
      >
        ({count})
      </span>
    )}
  </button>
);

// ==========================================
// ✅ MAIN BLOGS PAGE
// ==========================================
export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [status] = useState("published");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // ✅ FIX: useRef instead of useState for timeout
  const searchTimeoutRef = useRef(null);

  // Dynamic categories
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // ==========================================
  // ✅ FETCH CATEGORIES
  // ==========================================
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const data = await getAllBlogs({
          limit: 100,
          status: "published",
          sortBy: "createdAt",
          order: "desc",
        });

        if (data.success && data.data) {
          const catSet = new Set();
          data.data.forEach((blog) => {
            if (blog.category && blog.category.trim()) {
              catSet.add(blog.category.trim());
            }
          });
          setAvailableCategories(Array.from(catSet).sort());
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
        setAvailableCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // ✅ FETCH BLOGS
  // ==========================================
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllBlogs({
        page: currentPage,
        limit: 9,
        status: status,
        category: activeCategory || "",
        search: search,
        sortBy: sortBy,
        order: order,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch blogs");
      }

      setBlogs(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalBlogs(data.totalBlogs || 0);
      setHasNextPage(data.hasNextPage || false);
      setHasPrevPage(data.hasPrevPage || false);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, activeCategory, status, sortBy, order]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ✅ FIX: Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // ==========================================
  // ✅ SEARCH HANDLER (Debounced — FIXED)
  // ==========================================
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // ✅ FIX: Use ref instead of state for timeout
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // ==========================================
  // ✅ CATEGORY HANDLER
  // ==========================================
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat === "All" ? "" : cat);
    setCurrentPage(1);
  };

  // ==========================================
  // ✅ SORT HANDLER
  // ==========================================
  const handleSortChange = (e) => {
    const [by, ord] = e.target.value.split("-");
    setSortBy(by);
    setOrder(ord);
    setCurrentPage(1);
  };

  // ==========================================
  // ✅ PAGINATION
  // ==========================================
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // ==========================================
  // ✅ CLEAR ALL FILTERS
  // ==========================================
  const clearAllFilters = () => {
    setSearch("");
    setActiveCategory("");
    setSortBy("createdAt");
    setOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || activeCategory;

  // ==========================================
  // ✅ RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-white">
      {/* ============================== */}
      {/* HERO SECTION */}
      {/* ============================== */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(to bottom right, ${DARK_TEAL}, #0a2a2e, ${DARK_TEAL})` }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-20 -mt-20"
          style={{ background: `radial-gradient(circle, ${TURQUOISE}15, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl -ml-20 -mb-20"
          style={{ background: `radial-gradient(circle, ${PEACH}10, transparent)` }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                color: LIGHT_AQUA,
              }}
            >
              <BookOpen className="w-4 h-4" />
              Our Blog
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight mb-6">
              Insights &{" "}
              <span
                style={{
                  background: `linear-gradient(to right, ${TURQUOISE}, ${PEACH})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Articles
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Stay updated with the latest trends, tips, and stories from our experts.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              {/* ✅ FIX: Added z-10 and pointer-events-none to make icon visible above input */}
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 z-10 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search blogs by title, content, or tags..."
                className="relative w-full pl-12 pr-10 py-4 border rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${TURQUOISE}80`;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${TURQUOISE}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* ✅ CATEGORY FILTERS */}
      {/* ============================== */}
      <section
        className="sticky top-0 z-30 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(248,250,252,0.85)",
          borderBottom: `1px solid ${TURQUOISE}15`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Dynamic Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-hide">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />

              <CategoryButton
                category="All"
                count={0}
                isActive={!activeCategory}
                onClick={() => handleCategoryChange("All")}
              />

              {!categoryLoading && availableCategories.length > 0 && availableCategories.map((cat) => (
                <CategoryButton
                  key={cat}
                  category={cat}
                  count={0}
                  isActive={activeCategory === cat}
                  onClick={() => handleCategoryChange(cat)}
                />
              ))}

              {categoryLoading && (
                <span className="text-xs text-slate-400 px-3 py-2">
                  Loading categories...
                </span>
              )}

              {!categoryLoading && availableCategories.length === 0 && (
                <span className="text-xs text-slate-400 px-3 py-2">
                  No categories available
                </span>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500">Sort:</span>
              <select
                value={`${sortBy}-${order}`}
                onChange={handleSortChange}
                className="text-sm border rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none transition-all"
                style={{
                  borderColor: "#e2e8f0",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = TURQUOISE;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${TURQUOISE}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* BLOGS GRID */}
      {/* ============================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-slate-500">
            {loading ? (
              "Loading..."
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-slate-700">{blogs.length}</span> of{" "}
                <span className="font-semibold text-slate-700">{totalBlogs}</span> blogs
                {search && (
                  <>
                    {" "}for &ldquo;
                    <span className="font-semibold" style={{ color: TURQUOISE }}>{search}</span>
                    &rdquo;
                  </>
                )}
                {activeCategory && (
                  <>
                    {" "}in{" "}
                    <span className="font-semibold" style={{ color: TURQUOISE }}>{activeCategory}</span>
                  </>
                )}
              </>
            )}
          </p>

          {hasActiveFilters && !loading && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-slate-500 underline underline-offset-2 transition-colors"
              style={{ color: "#64748b" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TURQUOISE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              className="w-10 h-10 animate-spin mb-4"
              style={{ color: TURQUOISE }}
            />
            <p className="text-slate-500 text-sm">Loading blogs...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="border rounded-xl p-8 text-center max-w-md"
              style={{
                backgroundColor: `${DARK_PINK}08`,
                borderColor: `${DARK_PINK}20`,
              }}
            >
              <p className="font-medium mb-2" style={{ color: DARK_PINK }}>
                Failed to load blogs
              </p>
              <p className="text-sm mb-4" style={{ color: `${DARK_PINK}CC` }}>{error}</p>
              <button
                onClick={fetchBlogs}
                className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: DARK_PINK,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = DARK_ORANGE)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = DARK_PINK)}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No blogs found</h3>
            <p className="text-slate-500 text-sm mb-6 text-center max-w-md">
              {search || activeCategory
                ? "Try adjusting your search or filters."
                : "No blogs published yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!hasPrevPage}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                hasPrevPage
                  ? {
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      color: "#334155",
                    }
                  : {
                      backgroundColor: "#f1f5f9",
                      color: "#94a3b8",
                      cursor: "not-allowed",
                    }
              }
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className="w-10 h-10 rounded-lg text-sm font-medium transition-all"
                  style={
                    page === currentPage
                      ? {
                          background: `linear-gradient(135deg, ${TURQUOISE}, ${DARK_ORANGE})`,
                          color: "#ffffff",
                          boxShadow: `0 2px 8px ${TURQUOISE}30`,
                        }
                      : {
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          color: "#334155",
                        }
                  }
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!hasNextPage}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                hasNextPage
                  ? {
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      color: "#334155",
                    }
                  : {
                      backgroundColor: "#f1f5f9",
                      color: "#94a3b8",
                      cursor: "not-allowed",
                    }
              }
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}