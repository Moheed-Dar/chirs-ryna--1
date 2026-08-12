"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  ImagePlus,
  Hash,
  AlertCircle,
  Building2,
  DollarSign,
  MapPin,
  Home,
  Layers,
  Star,
  Eye,
  Phone,
  Mail,
  User,
  Image as ImageIcon,
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
import { updateProperty } from "@/lib/properties/api";

const PROPERTY_TYPES = [
  "house", "apartment", "villa", "penthouse",
  "plot", "commercial", "office", "shop",
  "warehouse", "farmhouse", "flat", "studio",
];

const PRICE_TYPES = ["sale", "rent"];
const CURRENCIES = ["PKR", "USD", "EUR", "GBP", "AED"];
const AREA_UNITS = ["sqft", "sqm", "marla", "kanal", "acre"];
const STATUS_OPTIONS = ["available", "sold", "pending", "rented", "unavailable"];

const SUGGESTED_FEATURES = [
  "Parking", "Garage", "Garden", "Swimming Pool",
  "Gym", "Security", "CCTV", "Elevator",
  "Balcony", "Terrace", "Central Heating", "AC",
  "Furnished", "Semi-Furnished", "Unfurnished",
  "Water Supply", "Gas Connection", "Electricity Backup",
  "Mosque Nearby", "Park Nearby", "School Nearby",
  "Hospital Nearby", "Shopping Mall Nearby", "Main Road",
];

const SUGGESTED_AMENITIES = [
  "WiFi", "TV Lounge", "Study Room", "Servant Quarter",
  "Laundry Room", "Store Room", "Rooftop Access",
  "Community Center", "Playground", "Jogging Track",
  "BBQ Area", "Sauna", "Spa", "Steam Room",
];

// ==========================================
// ✅ HTML DECODE HELPER
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
  const lastEmittedValue = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (value === lastEmittedValue.current) return;
      const decodedValue = decodeHtml(value);
      if (editorRef.current.innerHTML !== decodedValue) {
        editorRef.current.innerHTML = decodedValue || "";
        lastEmittedValue.current = decodedValue;
      }
    }
  }, [value]);

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
      lastEmittedValue.current = html;
      onChange(html);
    }
  };

  const applyFormat = (command, val = null) => {
    restoreSelection();
    document.execCommand(command, false, val);
    handleInput();
    saveSelection();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && selection.isCollapsed) {
        const currentBlock = selection.anchorNode;
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
      className="w-8 h-8 rounded-md flex items-center justify-center text-white/70 hover:bg-[#2B7FFF]/15 hover:text-[#2B7FFF] transition-colors"
      title={title}
    >
      <Icon size={15} />
    </button>
  );

  return (
    <div className="bg-[#0f2240] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-[#2B7FFF]/40 focus-within:ring-2 focus-within:ring-[#2B7FFF]/10 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/[0.08] bg-[#081730]">
        <select
          onMouseDown={saveSelection}
          onChange={(e) => {
            applyFormat('fontSize', e.target.value);
            e.target.value = "";
          }}
          className="bg-[#0f2240] border border-white/[0.08] rounded-md px-2 py-1 text-xs text-white/70 outline-none mr-1 cursor-pointer hover:border-[#2B7FFF]/40"
          defaultValue=""
          title="Font Size"
        >
          <option value="" disabled style={{ backgroundColor: "#0f2240" }}>Font Size</option>
          <option value="1" style={{ backgroundColor: "#0f2240" }}>Small</option>
          <option value="3" style={{ backgroundColor: "#0f2240" }}>Normal</option>
          <option value="5" style={{ backgroundColor: "#0f2240" }}>Large</option>
          <option value="6" style={{ backgroundColor: "#0f2240" }}>Huge</option>
        </select>

        <ToolButton icon={Bold} command="bold" title="Bold" />
        <ToolButton icon={Italic} command="italic" title="Italic" />
        <ToolButton icon={Underline} command="underline" title="Underline" />
        <ToolButton icon={Strikethrough} command="strikeThrough" title="Strikethrough" />
        <ToolButton icon={Eraser} command="removeFormat" title="Clear Formatting" />

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        <ToolButton icon={List} command="insertUnorderedList" title="Bullet List" />
        <ToolButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        <ToolButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
        <ToolButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
        <ToolButton icon={AlignRight} command="justifyRight" title="Align Right" />

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        <label 
          className="w-8 h-8 rounded-md flex items-center justify-center text-white/70 hover:bg-[#2B7FFF]/15 hover:text-[#2B7FFF] transition-colors cursor-pointer relative" 
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
          className="w-8 h-8 rounded-md flex items-center justify-center text-white/70 hover:bg-[#2B7FFF]/15 hover:text-[#2B7FFF] transition-colors cursor-pointer relative" 
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
        className="p-4 text-sm text-white outline-none min-h-[150px] 
                   [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 
                   [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 
                   [&_li]:ml-2 [&_li]:my-1
                   [&_p]:my-2 
                   [&_div]:my-2
                   [&_h1]:text-xl [&_h1]:font-bold [&_h1]:my-3 [&_h1]:text-white
                   [&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-white
                   [&_h3]:text-base [&_h3]:font-bold [&_h3]:my-2 [&_h3]:text-white
                   [&_blockquote]:border-l-4 [&_blockquote]:border-[#2B7FFF] [&_blockquote]:pl-4 [&_blockquote]:text-white/60 [&_blockquote]:italic"
      ></div>
    </div>
  );
}

// ============================================
// SECTION WRAPPER
// ============================================
function Section({ icon: Icon, title, children, optional }) {
  return (
    <div className="bg-white/2 rounded-2xl border border-white/6 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/10 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-[#2B7FFF]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {optional && (
            <span className="text-[10px] text-white/20">Optional</span>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ============================================
// FIELD WRAPPER
// ============================================
function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
        {label}{" "}
        {required && <span className="text-red-400/80 normal-case"> *</span>}
      </label>
      {children}
      {hint && <p className="text-white/15 text-[10px] mt-1">{hint}</p>}
    </div>
  );
}

// ============================================
// SAFE IMAGE URL
// ============================================
const getImgUrl = (img) => {
  if (!img) return "/placeholder.jpg";
  if (typeof img === "string" && img.trim()) return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return "/placeholder.jpg";
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertyUpdateForm({ property, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    priceType: "sale",
    currency: "PKR",
    location: "",
    city: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
    propertyType: "",
    propertyCode: "",
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    areaSize: "",
    areaUnit: "sqft",
    floors: "",
    yearBuilt: "",
    status: "available",
    isFeatured: false,
    isPublished: true,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    features: [],
    amenities: [],
  });

  // Calculate description length safely (stripping HTML)
  const descriptionTextLength = form.description ? form.description.replace(/<[^>]*>/g, ' ').trim().length : 0;

  // ============================================
  // POPULATE FORM FROM PROPERTY
  // ============================================
  useEffect(() => {
    if (!property) return;

    setForm({
      title: property.title || "",
      description: property.description || "",
      price: property.price?.toString() || "",
      priceType: property.priceType || "sale",
      currency: property.currency || "PKR",
      location: property.location || "",
      city: property.city || "",
      area: property.area || "",
      address: property.address || "",
      latitude: property.latitude?.toString() || "",
      longitude: property.longitude?.toString() || "",
      propertyType: property.propertyType || "",
      propertyCode: property.propertyCode || "",
      bedrooms: property.bedrooms?.toString() || "",
      bathrooms: property.bathrooms?.toString() || "",
      kitchens: property.kitchens?.toString() || "",
      areaSize: property.areaSize?.toString() || "",
      areaUnit: property.areaUnit || "sqft",
      floors: property.floors?.toString() || "",
      yearBuilt: property.yearBuilt?.toString() || "",
      status: property.status || "available",
      isFeatured: property.isFeatured || false,
      isPublished: property.isPublished !== false,
      contactName: property.contactName || property.addedBy?.name || "",
      contactPhone: property.contactPhone || property.addedBy?.phone || "",
      contactEmail: property.contactEmail || property.addedBy?.email || "",
      features: property.features || [],
      amenities: property.amenities || [],
    });

    setExistingImages(property.images || []);
    setLoading(false);
  }, [property]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleItem = (field, item) => {
    setForm((prev) => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter((i) => i !== item) };
      }
      return { ...prev, [field]: [...arr, item] };
    });
  };

  // ============================================
  // IMAGE HANDLERS
  // ============================================
  const getVisibleExistingImages = () => {
    return existingImages.filter(
      (img) => !removedImageIds.includes(img.public_id)
    );
  };

  const getTotalImageCount = () => {
    return getVisibleExistingImages().length + newImages.length;
  };

  const removeExistingImage = (publicId) => {
    setRemovedImageIds((prev) => [...prev, publicId]);
  };

  const restoreExistingImage = (publicId) => {
    setRemovedImageIds((prev) => prev.filter((id) => id !== publicId));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const currentTotal = getTotalImageCount();
    if (currentTotal + files.length > 10) {
      setError(`Maximum 10 images. Current: ${currentTotal}, Adding: ${files.length}`);
      return;
    }

    const addedFiles = [...newImages, ...files];
    const addedPreviews = [...newImagePreviews];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        addedPreviews.push(ev.target.result);
        setNewImagePreviews([...addedPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setNewImages(addedFiles);
    setError("");
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = [
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "price", label: "Price" },
      { key: "location", label: "Location" },
      { key: "city", label: "City" },
      { key: "propertyType", label: "Property Type" },
    ];

    const missingFields = requiredFields.filter(
      (f) => !form[f.key]?.toString().trim()
    );

    if (missingFields.length > 0) {
      setError(`Please fill: ${missingFields.map((f) => f.label).join(", ")}`);
      return;
    }

    // Check plain text length for description
    const plainTextDescription = form.description.replace(/<[^>]*>/g, ' ').trim();
    if (plainTextDescription.length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();

      // All text fields
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim()); // Sends formatted HTML
      fd.append("price", String(form.price));
      fd.append("priceType", form.priceType);
      fd.append("currency", form.currency);
      fd.append("location", form.location.trim());
      fd.append("city", form.city.trim());
      fd.append("area", (form.area || "").trim());
      fd.append("address", (form.address || "").trim());
      fd.append("latitude", form.latitude || "");
      fd.append("longitude", form.longitude || "");
      fd.append("propertyType", form.propertyType);
      fd.append("propertyCode", (form.propertyCode || "").trim());
      fd.append("bedrooms", String(form.bedrooms || 0));
      fd.append("bathrooms", String(form.bathrooms || 0));
      fd.append("kitchens", String(form.kitchens || 0));
      fd.append("floors", String(form.floors || 0));
      fd.append("areaSize", String(form.areaSize || 0));
      fd.append("areaUnit", form.areaUnit);
      fd.append("yearBuilt", form.yearBuilt || "");
      fd.append("status", form.status);
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isPublished", String(form.isPublished));
      fd.append("contactName", (form.contactName || "").trim());
      fd.append("contactPhone", (form.contactPhone || "").trim());
      fd.append("contactEmail", (form.contactEmail || "").trim());

      // JSON arrays
      fd.append("features", JSON.stringify(form.features || []));
      fd.append("amenities", JSON.stringify(form.amenities || []));

      // Images to remove
      if (removedImageIds.length > 0) {
        fd.append("removeImages", JSON.stringify(removedImageIds));
      }

      // New images
      if (newImages.length > 0) {
        newImages.forEach((img) => {
          fd.append("images", img);
        });
      }

      const res = await updateProperty(property._id, fd);

      if (res.success) {
        onSuccess();
      } else {
        const errorMsg = res.errors
          ? res.errors.map((err) => err.message || err).join(", ")
          : res.message || "Failed to update property";
        setError(errorMsg);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.errors
          ? err.response.data.errors.map((e) => e.message || e).join(", ")
          : err?.response?.data?.message ||
            err?.message ||
            "Something went wrong";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // CLASSES
  // ============================================
  const inputClass =
    "w-full bg-[#0f2240] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all";

  const selectClass =
    "w-full bg-[#0f2240] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all appearance-none";

  const optionStyle = { backgroundColor: "#0f2240" };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 bg-[#040d1a]/95"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="relative z-10 flex flex-col h-full bg-[#081730] items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader2 size={32} className="animate-spin text-[#2B7FFF]/50" />
          <span className="text-white/25 text-sm mt-3">Loading property...</span>
        </motion.div>
      </motion.div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  const visibleExisting = getVisibleExistingImages();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 bg-[#040d1a]/95"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col h-full bg-[#081730]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER ===== */}
        <div className="shrink-0 border-b border-white/6 bg-[#081730]">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Building2 size={18} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Edit Property
                </h2>
                <p className="text-white/30 text-[11px] -mt-0.5">
                  {form.propertyCode || property._id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <X size={16} className="text-white/50" />
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 lg:px-8 pb-3"
            >
              <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/15 rounded-xl flex items-center gap-3">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <p className="text-red-300 text-xs flex-1 wrap-break-word">{error}</p>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="shrink-0 p-0.5 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X size={13} className="text-red-400" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ===== SCROLLABLE CONTENT ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain will-change-transform">
          <form
            id="propertyUpdateForm"
            onSubmit={handleSubmit}
            className="px-6 lg:px-8 py-6 space-y-5 max-w-6xl mx-auto"
          >
            {/* ===== BASIC INFORMATION ===== */}
            <Section icon={Building2} title="Basic Information">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Property Code" hint="Leave empty to keep existing">
                  <div className="relative">
                    <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="text"
                      value={form.propertyCode}
                      onChange={(e) => handleChange("propertyCode", e.target.value)}
                      placeholder={property.propertyCode || "Auto-generated"}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Property Type" required>
                  <select
                    value={form.propertyType}
                    onChange={(e) => handleChange("propertyType", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" style={optionStyle}>Select type...</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t} style={optionStyle} className="capitalize">{t}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Title" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={inputClass}
                />
              </Field>

              {/* ✅ RICH TEXT EDITOR FOR DESCRIPTION */}
              <Field label="Description" required hint="Use the toolbar to format text (Minimum 20 characters)">
                <CustomRichTextEditor
                  value={form.description}
                  onChange={(val) => handleChange("description", val)}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-white/15 text-[10px]">Minimum 20 characters</p>
                  <p className={`text-[10px] ${descriptionTextLength < 20 ? 'text-red-400/80' : 'text-emerald-300/80'}`}>
                    {descriptionTextLength}/5000
                  </p>
                </div>
              </Field>
            </Section>

            {/* ===== PRICING ===== */}
            <Section icon={DollarSign} title="Pricing">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Price" required>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Price Type">
                  <select
                    value={form.priceType}
                    onChange={(e) => handleChange("priceType", e.target.value)}
                    className={selectClass}
                  >
                    {PRICE_TYPES.map((t) => (
                      <option key={t} value={t} style={optionStyle} className="capitalize">{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Currency">
                  <select
                    value={form.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className={selectClass}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} style={optionStyle}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </Section>

            {/* ===== LOCATION ===== */}
            <Section icon={MapPin} title="Location">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Location" required>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="City" required>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Area / Society">
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => handleChange("area", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Full Address">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Latitude" hint="Optional">
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Longitude" hint="Optional">
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Section>

            {/* ===== PROPERTY DETAILS ===== */}
            <Section icon={Home} title="Property Details" optional>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { key: "bedrooms", label: "Bedrooms" },
                  { key: "bathrooms", label: "Bathrooms" },
                  { key: "kitchens", label: "Kitchens" },
                  { key: "floors", label: "Floors" },
                ].map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <input
                      type="number"
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder="0"
                      className={inputClass}
                    />
                  </Field>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Area Size">
                  <input
                    type="number"
                    value={form.areaSize}
                    onChange={(e) => handleChange("areaSize", e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </Field>
                <Field label="Area Unit">
                  <select
                    value={form.areaUnit}
                    onChange={(e) => handleChange("areaUnit", e.target.value)}
                    className={selectClass}
                  >
                    {AREA_UNITS.map((u) => (
                      <option key={u} value={u} style={optionStyle}>{u}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Year Built">
                  <input
                    type="number"
                    value={form.yearBuilt}
                    onChange={(e) => handleChange("yearBuilt", e.target.value)}
                    placeholder="2024"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Section>

            {/* ===== STATUS ===== */}
            <Section icon={Eye} title="Status & Visibility" optional>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={selectClass}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} style={optionStyle} className="capitalize">{s}</option>
                    ))}
                  </select>
                </Field>
                <div className="flex items-end gap-6 pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => handleChange("isFeatured", !form.isFeatured)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.isFeatured ? "bg-[#2B7FFF]" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.isFeatured ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                    <div className="flex items-center gap-1.5">
                      <Star size={12} className="text-white/25" />
                      <span className="text-xs text-white/40">Featured</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => handleChange("isPublished", !form.isPublished)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? "bg-[#2B7FFF]" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.isPublished ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                    <div className="flex items-center gap-1.5">
                      <Eye size={12} className="text-white/25" />
                      <span className="text-xs text-white/40">Published</span>
                    </div>
                  </label>
                </div>
              </div>
            </Section>

            {/* ===== FEATURES & AMENITIES ===== */}
            <Section icon={Layers} title="Features & Amenities" optional>
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-white/40">Features</span>
                  <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                    {form.features.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_FEATURES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem("features", item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.features.includes(item)
                          ? "bg-[#2B7FFF]/15 text-[#2B7FFF] border border-[#2B7FFF]/25"
                          : "bg-white/3 text-white/30 border border-white/6 hover:bg-white/6 hover:text-white/50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-white/4" />
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-white/40">Amenities</span>
                  <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full">
                    {form.amenities.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_AMENITIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem("amenities", item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.amenities.includes(item)
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
                          : "bg-white/3 text-white/30 border border-white/6 hover:bg-white/6 hover:text-white/50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* ===== IMAGES ===== */}
            <Section icon={ImageIcon} title="Images" optional>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {/* Existing images (not removed) */}
                {visibleExisting.map((img, i) => (
                  <div
                    key={`existing-${img.public_id || i}`}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/8 group"
                  >
                    <Image
                      src={getImgUrl(img)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-[#2B7FFF]/90 text-white text-[8px] font-bold rounded-md uppercase tracking-wider shadow-lg">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.public_id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={11} className="text-white" />
                    </button>
                  </div>
                ))}

                {/* New images */}
                {newImagePreviews.map((src, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[#2B7FFF]/30 group"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#2B7FFF]/80 text-white text-[7px] font-bold rounded-md uppercase">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={11} className="text-white" />
                    </button>
                  </div>
                ))}

                {/* Add button */}
                {getTotalImageCount() < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-white/8 hover:border-[#2B7FFF]/30 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/2">
                    <ImagePlus size={22} className="text-white/15 mb-1" />
                    <span className="text-[10px] text-white/20 font-medium">Add</span>
                    <span className="text-[9px] text-white/10">{getTotalImageCount()}/10</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Removed images — restore option */}
              {removedImageIds.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/4">
                  <p className="text-[10px] text-red-400/60 mb-2 uppercase tracking-wider font-semibold">
                    Marked for removal ({removedImageIds.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {removedImageIds.map((publicId) => {
                      const img = existingImages.find((im) => im.public_id === publicId);
                      if (!img) return null;
                      return (
                        <button
                          key={publicId}
                          type="button"
                          onClick={() => restoreExistingImage(publicId)}
                          className="relative w-16 h-12 rounded-lg overflow-hidden border border-red-500/30 opacity-40 hover:opacity-80 transition-opacity"
                          title="Click to restore"
                        >
                          <Image
                            src={getImgUrl(img)}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                          <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                            <span className="text-white text-[9px] font-bold">RESTORE</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-white/15 text-[10px] mt-2">
                Hover over image and click X to remove. Removed images can be restored. First image is cover.
              </p>
            </Section>

            {/* ===== CONTACT ===== */}
            <Section icon={Phone} title="Contact Information" optional>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Contact Name">
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/15" />
                    <input
                      type="text"
                      value={form.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
                <Field label="Contact Phone">
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/15" />
                    <input
                      type="tel"
                      value={form.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
                <Field label="Contact Email">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/15" />
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            <div className="h-24" />
          </form>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="shrink-0 border-t border-white/6 bg-[#081730] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16 max-w-6xl mx-auto">
            <p className="text-white/20 text-xs hidden sm:block">
              <span className="text-red-400/60">*</span> Required fields
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-white/10 text-white/50 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="propertyUpdateForm"
                disabled={saving}
                className="flex items-center gap-2 px-7 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Building2 size={15} />
                    Update Property
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}