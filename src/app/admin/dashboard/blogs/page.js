"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBlogs, deleteBlog } from "@/lib/blogs/api";
import BlogsCreateForm from "@/components/forms/BlogsCreateForm";
import BlogsUpdateForm from "@/components/forms/BlogsUpdateForm";
import BlogDetailView from "@/components/forms/BlogDetailView";

const getSafeImg = (img) => {
  if (!img) return "/placeholder.jpg";
  if (typeof img === "string" && img.trim()) return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return "/placeholder.jpg";
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewBlogId, setViewBlogId] = useState(null);
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const limit = 10;

  const fetchBlogs = useCallback(async (page = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getAllBlogs({ page, limit, search: searchTerm });
      setBlogs(res.data || []);
      setTotalPages(res.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBlogs(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchBlogs]);

  const handleRefresh = () => fetchBlogs(currentPage, true);

  const handleRowClick = (blog) => setViewBlogId(blog._id);

  const handleEditFromDetail = (blog) => {
    setViewBlogId(null);
    setSelectedBlog(blog);
    setShowUpdateModal(true);
  };

  const handleDeletedFromDetail = async (id) => {
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setViewBlogId(null);
    } catch (error) {
      console.error("Failed to delete blog from detail view:", error);
      alert(error?.message || "Failed to delete blog.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setDeleteError("");

    try {
      await deleteBlog(deleteConfirm._id);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (error) {
      // Yahan error.message check karna zaroori hai kyunki api.js se error.response.data throw hota hai
      const errorMsg = error?.message || error?.response?.data?.message || "Failed to delete blog.";
      setDeleteError(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setSelectedBlog(null);
    fetchBlogs(currentPage);
  };

  return (
    <div className="font-inter">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#FFF7F0] font-playfair">Blog Posts</h1>
          <p className="text-[#FFF7F0]/40 text-sm">Manage your blog articles</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="w-10 h-10 rounded-xl border border-[#FFF7F0]/10 flex items-center justify-center text-[#FFF7F0]/40 hover:text-[#FFF7F0] hover:bg-[#FFF7F0]/5 hover:border-[#FFF7F0]/20 disabled:opacity-40 transition-all"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#20B2B8] hover:bg-[#1a9ca1] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#20B2B8]/25"
          >
            <Plus size={16} /> Add Blog
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FFF7F0]/30" />
        <input
          type="text"
          placeholder="Search blogs by title or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1E3040] border border-[#FFF7F0]/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#FFF7F0] placeholder:text-[#FFF7F0]/25 focus:outline-none focus:border-[#20B2B8]/40 focus:ring-2 focus:ring-[#20B2B8]/10 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#FFF7F0]/10 transition-colors"
          >
            <X size={14} className="text-[#FFF7F0]/30" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-[#20B2B8]/50" />
            <span className="text-[#FFF7F0]/25 text-xs">Loading blogs...</span>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-[#20B2B8]/10 flex items-center justify-center mx-auto mb-4 border border-[#20B2B8]/15">
            <FileText size={28} className="text-[#20B2B8]/40" />
          </div>
          <p className="text-[#FFF7F0]/40 text-sm mb-1">No blogs found</p>
          <p className="text-[#FFF7F0]/20 text-xs mb-4">
            {searchTerm ? "Try a different search term" : "Create your first blog post"}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-[#20B2B8] text-sm font-semibold hover:underline"
          >
            + Add Blog
          </button>
        </div>
      ) : (
        <>
          <div className="bg-[#1E3040] rounded-2xl border border-[#FFF7F0]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#FFF7F0]/10 bg-[#FFF7F0]/3">
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-[#FFF7F0]/30 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-[#FFF7F0]/30 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-[#FFF7F0]/30 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-[#FFF7F0]/30 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-[#FFF7F0]/30 uppercase tracking-wider">Read Time</th>
                    <th className="px-4 py-3.5 text-right text-[10px] font-bold text-[#FFF7F0]/30 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFF7F0]/6">
                  {blogs.map((blog, index) => (
                    <tr
                      key={blog._id}
                      onClick={() => handleRowClick(blog)}
                      className="hover:bg-[#FFF7F0]/3 transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-3.5 text-[#FFF7F0]/30 text-xs">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#FFF7F0]/5 shrink-0 border border-[#FFF7F0]/10">
                            <Image
                              src={getSafeImg(blog.featuredImage)}
                              alt={blog.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#FFF7F0] font-medium text-sm truncate max-w-55 group-hover:text-[#20B2B8] transition-colors">
                              {blog.title}
                            </p>
                            <p className="text-[#FFF7F0]/25 text-[11px] truncate max-w-55">
                              {blog.excerpt || "No excerpt available"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[#FFF7F0]/40 text-xs">{blog.category}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            blog.status === "published"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                              : blog.status === "draft"
                              ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20"
                              : "bg-red-500/15 text-red-300 border border-red-500/20"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[#FFF7F0]/40 text-xs">{blog.readTime} min</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBlog(blog);
                              setShowUpdateModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-[#20B2B8]/10 text-[#FFF7F0]/30 hover:text-[#20B2B8] transition-all"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(blog);
                              setDeleteError("");
                            }}
                            className="p-2 rounded-lg hover:bg-[#D81B60]/10 text-[#FFF7F0]/30 hover:text-[#D81B60] transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchBlogs(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#FFF7F0]/10 text-[#FFF7F0]/40 hover:border-[#20B2B8]/50 hover:text-[#20B2B8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
                <button
                  key={item}
                  onClick={() => fetchBlogs(item)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    currentPage === item
                      ? "bg-[#20B2B8] text-white shadow-lg shadow-[#20B2B8]/25"
                      : "border border-[#FFF7F0]/10 text-[#FFF7F0]/40 hover:border-[#20B2B8]/50 hover:text-[#20B2B8]"
                  }`}
                >
                  {item}
                </button>
              ))}

              <button
                onClick={() => fetchBlogs(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#FFF7F0]/10 text-[#FFF7F0]/40 hover:border-[#20B2B8]/50 hover:text-[#20B2B8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {showCreateModal && (
          <BlogsCreateForm onClose={() => setShowCreateModal(false)} onSuccess={handleFormSuccess} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpdateModal && selectedBlog && (
          <BlogsUpdateForm
            blog={selectedBlog}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedBlog(null);
            }}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewBlogId && (
          <BlogDetailView
            blogId={viewBlogId}
            onClose={() => setViewBlogId(null)}
            onEdit={handleEditFromDetail}
            onDeleted={handleDeletedFromDetail}
          />
        )}
      </AnimatePresence>

      {/* ===== DELETE CONFIRMATION ===== */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70"
              onClick={() => !deleting && (setDeleteConfirm(null), setDeleteError(""))}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[#1E3040] rounded-2xl border border-[#FFF7F0]/10 max-w-md w-full p-6 shadow-2xl"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#D81B60]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative w-12 h-12 rounded-xl bg-[#D81B60]/10 flex items-center justify-center mb-4 border border-[#D81B60]/15">
                <Trash2 size={20} className="text-[#D81B60]" />
              </div>

              <h3 className="text-lg font-bold text-[#FFF7F0] mb-1.5 font-playfair">Delete Blog Post</h3>
              <p className="text-[#FFF7F0]/50 text-sm mb-1">Are you sure you want to delete:</p>
              <p className="text-[#FFF7F0] font-semibold text-sm mb-5 px-3 py-2 bg-[#FFF7F0]/5 rounded-lg border border-[#FFF7F0]/10">
                {deleteConfirm.title}
              </p>

              {deleteError && (
                <div className="mb-4 px-3.5 py-2.5 bg-[#D81B60]/10 border border-[#D81B60]/15 rounded-xl">
                  <p className="text-[#D81B60] text-xs">{deleteError}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setDeleteConfirm(null); setDeleteError(""); }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-[#FFF7F0]/10 text-[#FFF7F0]/60 text-sm font-semibold rounded-xl hover:bg-[#FFF7F0]/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D81B60] hover:bg-[#c11957] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <><Loader2 size={15} className="animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 size={14} /> Delete</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}