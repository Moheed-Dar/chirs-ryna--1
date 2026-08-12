"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Edit, Trash2, ExternalLink, Calendar, Tag, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { getBlogById } from "@/lib/blogs/api";

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

export default function BlogDetailView({ blogId, onClose, onEdit, onDeleted }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(blogId);
        setBlog(res.data || res);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 bg-[#172636]/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#1E3040] rounded-2xl border border-[#FFF7F0]/10 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <Loader2 size={24} className="animate-spin text-[#20B2B8]" />
          </div>
        ) : blog ? (
          <>
            <div className="shrink-0 flex items-center justify-between p-5 border-b border-[#FFF7F0]/10 gap-4">
              {/* ✅ Added truncate so long titles don't break layout */}
              <h2 className="text-lg font-bold text-[#FFF7F0] truncate flex-1">{blog.title}</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#FFF7F0]/5 shrink-0">
                <X size={18} className="text-[#FFF7F0]/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ✅ Check both featuredImage and image for fallback */}
              {(blog.featuredImage?.url || blog.image) && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#FFF7F0]/10">
                  <img 
                    src={blog.featuredImage?.url || blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-[#FFF7F0]/50">
                <span className="flex items-center gap-1.5">
                  <Tag size={12} className="text-[#20B2B8]" /> {blog.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-[#20B2B8]" /> {blog.readTime || "1"} min read
                </span>
                {blog.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#20B2B8]" />
                    {new Date(blog.publishedAt).toLocaleDateString()}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  blog.status === "published" ? "bg-emerald-500/15 text-emerald-300" : 
                  blog.status === "draft" ? "bg-yellow-500/15 text-yellow-300" : 
                  "bg-red-500/15 text-red-300"
                }`}>
                  {blog.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#FFF7F0] uppercase tracking-wider mb-2">Content</h3>
                {/* ✅ FIXED: Replaced plain text with dangerouslySetInnerHTML and added break-words & overflow-hidden */}
                <div 
                  className="text-sm text-[#FFF7F0]/70 leading-relaxed bg-[#1F2D3D] p-4 rounded-xl border border-[#FFF7F0]/5 overflow-hidden break-words
                             [&_p]:my-2 [&_div]:my-2 
                             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 
                             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 
                             [&_li]:ml-2 [&_li]:my-1 
                             [&_h1]:text-base [&_h1]:font-bold [&_h1]:my-2 [&_h1]:text-[#FFF7F0]
                             [&_h2]:text-sm [&_h2]:font-bold [&_h2]:my-2 [&_h2]:text-[#FFF7F0]
                             [&_blockquote]:border-l-4 [&_blockquote]:border-[#20B2B8] [&_blockquote]:pl-4 [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(blog.content) || "No content available." }}
                />
              </div>

              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-[#FFF7F0]/5 text-[#FFF7F0]/60 rounded-md text-xs border border-[#FFF7F0]/10">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center justify-end gap-2 p-4 border-t border-[#FFF7F0]/10 bg-[#1E3040] rounded-b-2xl">
              <button
                onClick={() => onEdit(blog)}
                className="flex items-center gap-2 px-4 py-2 bg-[#20B2B8]/10 text-[#20B2B8] border border-[#20B2B8]/20 rounded-lg text-sm font-medium hover:bg-[#20B2B8]/20 transition-colors"
              >
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => onDeleted(blog._id)}
                className="flex items-center gap-2 px-4 py-2 bg-[#D81B60]/10 text-[#D81B60] border border-[#D81B60]/20 rounded-lg text-sm font-medium hover:bg-[#D81B60]/20 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-10 text-[#FFF7F0]/50">
            Blog not found.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}