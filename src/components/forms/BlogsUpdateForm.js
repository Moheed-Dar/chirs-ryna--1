"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  ImagePlus,
  AlertCircle,
  FileText,
  Tag,
  Hash,
  Plus,
  ListChecks,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Palette,
  Eraser,
} from "lucide-react";
import { motion } from "framer-motion";
import { updateBlog } from "@/lib/blogs/api";

const CATEGORIES = [
  "Buying Tips", "Selling Tips", "Market Updates", "First-Time Buyers",
  "Mortgage Advice", "Home Maintenance", "Neighborhood Guides",
  "Investment Properties", "Luxury Homes"
];
const STATUSES = ["draft", "published", "archived"];

// ==========================================
// ✅ HTML DECODE HELPER (Fixes raw tags issue on edit)
// ==========================================
const decodeHtml = (html) => {
  if (!html) return "";
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// ==========================================
// ✅ CUSTOM RICH TEXT EDITOR COMPONENT
// ==========================================
function CustomRichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const savedRange = useRef(null);
  const lastEmittedValue = useRef(null); // ✅ Prevents cursor jump on re-renders

  // Sync external value changes (like when blog data loads) into the editor
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      // If the value coming from parent is exactly what we just emitted, 
      // do nothing to prevent cursor jump!
      if (value === lastEmittedValue.current) return;

      const decodedValue = decodeHtml(value);
      
      // Only update DOM if it's different to avoid unnecessary resets
      if (editorRef.current.innerHTML !== decodedValue) {
        editorRef.current.innerHTML = decodedValue || "";
        lastEmittedValue.current = decodedValue; // Sync the tracker
      }
    }
  }, [value]);

  // Set default paragraph separator to div for cleaner HTML
  useEffect(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'div');
    } catch (e) {}
  }, []);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedRange.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastEmittedValue.current = html; // Track what we are emitting
      onChange(html);
    }
  };

  const applyFormat = (command, val = null) => {
    restoreSelection();
    document.execCommand(command, false, val);
    handleInput(); // Update state after formatting
    saveSelection();
  };

  // Smart Enter: If pressed on an empty line, clear formatting to prevent carry-over
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && selection.isCollapsed) {
        const currentBlock = selection.anchorNode;
        // Sometimes it's a text node, sometimes an element
        const blockElement = currentBlock.nodeType === 3 ? currentBlock.parentElement : currentBlock;
        
        if (blockElement && blockElement.textContent.trim() === '') {
          setTimeout(() => {
            document.execCommand('removeFormat', false);
            handleInput();
          }, 0);
        }
      }
    }
  };

  const ToolButton = ({ icon: Icon, command, title }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => applyFormat(command)}
      className="w-8 h-8 rounded-md flex items-center justify-center text-[#FFF7F0]/70 hover:bg-[#F2673A]/15 hover:text-[#F2673A] transition-colors"
      title={title}
    >
      <Icon size={15} />
    </button>
  );

  return (
    <div className="bg-[#1F2D3D] border border-[#FFF7F0]/[0.08] rounded-xl overflow-hidden focus-within:border-[#F2673A]/40 focus-within:ring-2 focus-within:ring-[#F2673A]/10 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#FFF7F0]/[0.08] bg-[#172636]">
        <select
          onMouseDown={saveSelection}
          onChange={(e) => {
            applyFormat('fontSize', e.target.value);
            e.target.value = "";
          }}
          className="bg-[#1F2D3D] border border-[#FFF7F0]/[0.08] rounded-md px-2 py-1 text-xs text-[#FFF7F0]/70 outline-none mr-1 cursor-pointer hover:border-[#F2673A]/40"
          defaultValue=""
          title="Font Size"
        >
          <option value="" disabled style={{ backgroundColor: "#1F2D3D" }}>Font Size</option>
          <option value="1" style={{ backgroundColor: "#1F2D3D" }}>Small</option>
          <option value="3" style={{ backgroundColor: "#1F2D3D" }}>Normal</option>
          <option value="5" style={{ backgroundColor: "#1F2D3D" }}>Large</option>
          <option value="6" style={{ backgroundColor: "#1F2D3D" }}>Huge</option>
        </select>

        <ToolButton icon={Bold} command="bold" title="Bold" />
        <ToolButton icon={Italic} command="italic" title="Italic" />
        <ToolButton icon={Underline} command="underline" title="Underline" />
        <ToolButton icon={Strikethrough} command="strikeThrough" title="Strikethrough" />
        
        {/* Clear Formatting Button */}
        <ToolButton icon={Eraser} command="removeFormat" title="Clear Formatting" />

        <div className="w-px h-6 bg-[#FFF7F0]/10 mx-1"></div>

        <ToolButton icon={List} command="insertUnorderedList" title="Bullet List" />
        <ToolButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />

        <div className="w-px h-6 bg-[#FFF7F0]/10 mx-1"></div>

        <ToolButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
        <ToolButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
        <ToolButton icon={AlignRight} command="justifyRight" title="Align Right" />

        <div className="w-px h-6 bg-[#FFF7F0]/10 mx-1"></div>

        <label 
          className="w-8 h-8 rounded-md flex items-center justify-center text-[#FFF7F0]/70 hover:bg-[#F2673A]/15 hover:text-[#F2673A] transition-colors cursor-pointer relative" 
          title="Text Color"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Palette size={15} />
          <input
            type="color"
            onChange={(e) => applyFormat('foreColor', e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        <label 
          className="w-8 h-8 rounded-md flex items-center justify-center text-[#FFF7F0]/70 hover:bg-[#F2673A]/15 hover:text-[#F2673A] transition-colors cursor-pointer relative" 
          title="Highlight Color"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Highlighter size={15} />
          <input
            type="color"
            onChange={(e) => applyFormat('hiliteColor', e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        suppressContentEditableWarning={true}
        className="p-4 text-sm text-[#FFF7F0] outline-none min-h-[200px] 
                   [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 
                   [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 
                   [&_li]:ml-2 [&_li]:my-1
                   [&_p]:my-2 
                   [&_div]:my-2
                   [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3 [&_h1]:text-white
                   [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-white
                   [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_h3]:text-white
                   [&_blockquote]:border-l-4 [&_blockquote]:border-[#F2673A] [&_blockquote]:pl-4 [&_blockquote]:text-[#FFF7F0]/60 [&_blockquote]:italic"
      ></div>
    </div>
  );
}

function Section({ icon: Icon, title, children, optional }) {
  return (
    <div className="bg-[#FFF7F0]/2 rounded-2xl border border-[#FFF7F0]/6 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[#F2673A]/10 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-[#F2673A]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#FFF7F0]">{title}</h3>
          {optional && <span className="text-[10px] text-[#FFF7F0]/20">Optional</span>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#FFF7F0]/40 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-[#D81B60] normal-case"> *</span>}
      </label>
      {children}
      {hint && <p className="text-[#FFF7F0]/15 text-[10px] mt-1">{hint}</p>}
    </div>
  );
}

export default function BlogsUpdateForm({ blog, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  
  const [pointInput, setPointInput] = useState({ title: "", description: "" });

  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    status: "draft",
    tags: [],
    slug: "",
    points: [], 
  });

  useEffect(() => {
    if (!blog) return;
    setForm({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      category: blog.category || "",
      status: blog.status || "draft",
      tags: blog.tags || [],
      slug: blog.slug || "",
      points: blog.points || [], 
    });
    setImagePreview(blog.featuredImage?.url || null);
    setLoading(false);
  }, [blog]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // TAGS HANDLERS
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  // POINTS HANDLERS
  const handlePointChange = (field, value) => {
    setPointInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPoint = () => {
    if (!pointInput.title.trim()) {
      setError("Point title is required to add a point.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      points: [...prev.points, { title: pointInput.title.trim(), description: pointInput.description.trim() }],
    }));
    setPointInput({ title: "", description: "" }); 
    setError("");
  };

  const handleRemovePoint = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      points: prev.points.filter((_, index) => index !== indexToRemove),
    }));
  };

  // IMAGE HANDLER
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeaturedImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const plainTextContent = form.content.replace(/<[^>]*>/g, ' ').trim();

    if (!form.title.trim() || !plainTextContent || !form.category) {
      setError("Title, Content, and Category are required");
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content.trim());
      fd.append("excerpt", form.excerpt.trim());
      fd.append("category", form.category);
      fd.append("status", form.status);
      fd.append("tags", JSON.stringify(form.tags));
      fd.append("slug", form.slug.trim());
      fd.append("points", JSON.stringify(form.points));

      if (featuredImage) {
        fd.append("featuredImage", featuredImage);
      }

      const res = await updateBlog(blog._id, fd);
      if (res.success) {
        onSuccess();
      } else {
        const errorMsg = res.errors?.join(", ") || res.message || "Failed to update blog";
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err?.errors?.join(", ") || err?.message || "Something went wrong";
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-[#1F2D3D] border border-[#FFF7F0]/[0.08] rounded-xl px-4 py-2.5 text-sm text-[#FFF7F0] placeholder:text-[#FFF7F0]/20 outline-none focus:border-[#F2673A]/40 focus:ring-2 focus:ring-[#F2673A]/10 transition-all";
  const selectClass = `${inputClass} appearance-none`;
  const optionStyle = { backgroundColor: "#1F2D3D" };

  const contentTextLength = form.content ? form.content.replace(/<[^>]*>/g, ' ').trim().length : 0;

  if (loading) {
    return (
      <div className="fixed inset-0 z-9999 bg-[#172636]/95 flex items-center justify-center" onClick={onClose}>
        <Loader2 size={32} className="animate-spin text-[#F2673A]/50" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 bg-[#172636]/95"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="relative z-10 flex flex-col h-full bg-[#1F2D3D]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-[#FFF7F0]/6 bg-[#1F2D3D]">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F2673A]/10 flex items-center justify-center">
                <FileText size={18} className="text-[#F2673A]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#FFF7F0]">Edit Blog Post</h2>
                <p className="text-[#FFF7F0]/30 text-[11px] -mt-0.5">{form.slug || blog._id}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-xl border border-[#FFF7F0]/10 flex items-center justify-center hover:bg-[#FFF7F0]/5 transition-colors">
              <X size={16} className="text-[#FFF7F0]/50" />
            </button>
          </div>

          {error && (
            <div className="px-6 lg:px-8 pb-3">
              <div className="px-4 py-2.5 bg-[#D81B60]/10 border border-[#D81B60]/15 rounded-xl flex items-center gap-3">
                <AlertCircle size={15} className="text-[#D81B60] shrink-0" />
                <p className="text-[#D81B60] text-xs flex-1">{error}</p>
                <button onClick={() => setError("")} className="p-0.5 hover:bg-[#D81B60]/20 rounded-lg">
                  <X size={13} className="text-[#D81B60]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <form
            id="blogUpdateForm"
            onSubmit={handleSubmit}
            className="px-6 lg:px-8 py-6 space-y-5 max-w-4xl mx-auto"
          >
            <Section icon={FileText} title="Blog Information">
              <Field label="Title" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={inputClass}
                />
              </Field>

              {/* RICH TEXT EDITOR FOR UPDATE FORM */}
              <Field label="Content" required hint="Use the toolbar to format text (Minimum 100 characters)">
                <CustomRichTextEditor
                  value={form.content}
                  onChange={(val) => handleChange("content", val)}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[#FFF7F0]/15 text-[10px]"></span>
                  <span className={`text-[10px] ${contentTextLength < 100 ? 'text-[#D81B60]/70' : 'text-emerald-400/70'}`}>
                    {contentTextLength} / 100 characters
                  </span>
                </div>
              </Field>

              <Field label="Excerpt">
                <textarea
                  value={form.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </Section>

            <Section icon={Hash} title="Categorization">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" style={optionStyle}>Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} style={optionStyle}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={selectClass}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} style={optionStyle} className="capitalize">{s}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Slug" hint="Leave empty to keep existing">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Tags">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2.5 bg-[#F2673A]/15 text-[#F2673A] rounded-xl text-sm font-medium hover:bg-[#F2673A]/25 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF7F0]/5 text-[#FFF7F0]/70 rounded-lg text-xs border border-[#FFF7F0]/10"
                    >
                      <Tag size={10} />
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        <X size={12} className="hover:text-[#D81B60]" />
                      </button>
                    </span>
                  ))}
                </div>
              </Field>
            </Section>

            {/* KEY POINTS SECTION */}
            <Section icon={ListChecks} title="Key Points" optional>
              <div className="space-y-3 p-4 bg-[#FFF7F0]/3 rounded-xl border border-[#FFF7F0]/5">
                <Field label="Point Title" required>
                  <input
                    type="text"
                    value={pointInput.title}
                    onChange={(e) => handlePointChange("title", e.target.value)}
                    placeholder="E.g. Great Location"
                    className={inputClass}
                  />
                </Field>
                <Field label="Point Description" hint="Max 500 characters">
                  <textarea
                    value={pointInput.description}
                    onChange={(e) => handlePointChange("description", e.target.value)}
                    placeholder="Brief description of the point"
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <button
                  type="button"
                  onClick={handleAddPoint}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F2673A]/10 text-[#F2673A] border border-[#F2673A]/20 rounded-xl text-sm font-medium hover:bg-[#F2673A]/20 transition-colors"
                >
                  <Plus size={14} /> Add Point
                </button>
              </div>

              {form.points.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-semibold text-[#FFF7F0]/40 uppercase tracking-wider mb-2">
                    Added Points ({form.points.length})
                  </p>
                  {form.points.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-[#1F2D3D] rounded-lg border border-[#FFF7F0]/8"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#F2673A]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[#F2673A] text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#FFF7F0]">{point.title}</p>
                        {point.description && (
                          <p className="text-xs text-[#FFF7F0]/40 mt-0.5">{point.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(index)}
                        className="p-1 rounded-md hover:bg-[#D81B60]/10 transition-colors group"
                      >
                        <X size={14} className="text-[#FFF7F0]/30 group-hover:text-[#D81B60]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section icon={ImagePlus} title="Featured Image" optional>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {imagePreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#FFF7F0]/8 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {featuredImage && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#F2673A]/80 text-white text-[7px] font-bold rounded-md uppercase">
                        New
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => { setFeaturedImage(null); setImagePreview(null); }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#D81B60]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="aspect-video rounded-xl border-2 border-dashed border-[#FFF7F0]/8 hover:border-[#F2673A]/30 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#FFF7F0]/2 sm:col-span-1">
                    <ImagePlus size={22} className="text-[#FFF7F0]/15 mb-1" />
                    <span className="text-[10px] text-[#FFF7F0]/20 font-medium">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </Section>

            <div className="h-24" />
          </form>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#FFF7F0]/6 bg-[#1F2D3D] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16 max-w-4xl mx-auto">
            <p className="text-[#FFF7F0]/20 text-xs hidden sm:block">
              <span className="text-[#D81B60]/60">*</span> Required fields
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-[#FFF7F0]/10 text-[#FFF7F0]/50 text-sm font-semibold rounded-xl hover:bg-[#FFF7F0]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="blogUpdateForm"
                disabled={saving}
                className="flex items-center gap-2 px-7 py-2.5 bg-[#F2673A] hover:bg-[#db5a32] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#F2673A]/20"
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin" /> Updating...</>
                ) : (
                  <><FileText size={15} /> Update Blog</>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}