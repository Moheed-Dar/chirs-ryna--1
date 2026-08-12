"use client";

import { useState, useRef, useEffect } from "react";
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
import { createProperty } from "@/lib/properties/api";

const PROPERTY_TYPES = [
  "house", "apartment", "villa", "penthouse",
  "plot", "commercial", "office", "shop",
  "warehouse", "farmhouse", "flat", "studio",
];

const PRICE_TYPES = ["sale", "rent"];
const CURRENCIES = ["PKR", "USD", "EUR", "GBP", "AED"];
const AREA_UNITS = ["sqft", "sqm", "marla", "kanal", "acre"];

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
// ✅ CUSTOM RICH TEXT EDITOR COMPONENT (Blue Theme)
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
            <span className="text-[10px] text-white">Optional</span>
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
      <label className="block text-[11px] font-semibold text-white uppercase tracking-wider mb-1.5">
        {label}{" "}
        {required && <span className="text-red-400/80 normal-case"> *</span>}
      </label>
      {children}
      {hint && (
        <p className="text-white text-[10px] mt-1">{hint}</p>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertyCreateForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    areaSize: "",
    areaUnit: "sqft",
    floors: "",
    yearBuilt: "",
    isFeatured: false,
    isPublished: true,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    features: [],
    amenities: [],
    propertyCode: "",
  });

  // Calculate description length safely (stripping HTML)
  const descriptionTextLength = form.description ? form.description.replace(/<[^>]*>/g, ' ').trim().length : 0;

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    const newImages = [...images, ...files];
    const newPreviews = [...imagePreviews];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviews.push(ev.target.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setImages(newImages);
    setError("");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
      setError(
        `Please fill: ${missingFields.map((f) => f.label).join(", ")}`
      );
      return;
    }

    // Check plain text length for description
    const plainTextDescription = form.description.replace(/<[^>]*>/g, ' ').trim();
    if (plainTextDescription.length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

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
      fd.append("bedrooms", String(form.bedrooms || 0));
      fd.append("bathrooms", String(form.bathrooms || 0));
      fd.append("kitchens", String(form.kitchens || 0));
      fd.append("floors", String(form.floors || 0));
      fd.append("areaSize", String(form.areaSize || 0));
      fd.append("areaUnit", form.areaUnit);
      fd.append("yearBuilt", form.yearBuilt || "");
      fd.append("isFeatured", String(form.isFeatured));
      fd.append("isPublished", String(form.isPublished));
      fd.append("contactName", (form.contactName || "").trim());
      fd.append("contactPhone", (form.contactPhone || "").trim());
      fd.append("contactEmail", (form.contactEmail || "").trim());
      fd.append("features", JSON.stringify(form.features || []));
      fd.append("amenities", JSON.stringify(form.amenities || []));
      fd.append("propertyCode", (form.propertyCode || "").trim());

      if (images.length > 0) {
        images.forEach((img) => {
          fd.append("images", img);
        });
      }

      const res = await createProperty(fd);

      if (res.success) {
        onSuccess();
      } else {
        const errorMsg = res.errors
          ? res.errors.map((err) => err.message || err).join(", ")
          : res.message || "Failed to create property";
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
      setLoading(false);
    }
  };

  // ============================================
  // CLASSES
  // ============================================
  const inputClass =
    "w-full bg-[#0f2240] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all";

  const selectClass =
    "w-full bg-[#0f2240] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all appearance-none";

  const optionStyle = { backgroundColor: "#0f2240" };

  // ============================================
  // RENDER
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 bg-[#040d1a]/95"
      onClick={onClose}
    >
      {/* ===== MAIN CONTAINER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col h-full bg-[#081730]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== STICKY HEADER ===== */}
        <div className="shrink-0 border-b border-white/6 bg-[#081730]">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2B7FFF]/10 flex items-center justify-center">
                <Building2 size={18} className="text-[#2B7FFF]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Add New Property
                </h2>
                <p className="text-white text-[11px] -mt-0.5">
                  Fill in all the details below
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Error Bar */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 lg:px-8 pb-3"
            >
              <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/15 rounded-xl flex items-center gap-3">
                <AlertCircle
                  size={15}
                  className="text-red-400 shrink-0"
                />
                <p className="text-red-300 text-xs flex-1 wrap-break-word">
                  {error}
                </p>
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
            id="propertyCreateForm"
            onSubmit={handleSubmit}
            className="px-6 lg:px-8 py-6 space-y-5 max-w-6xl mx-auto"
          >
            {/* ============================= */}
            {/* SECTION: BASIC INFORMATION    */}
            {/* ============================= */}
            <Section icon={Building2} title="Basic Information">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Property Code (Optional)" hint="Auto-generated if left empty">
                  <div className="relative">
                    <Hash
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
                    />
                    <input
                      type="text"
                      value={form.propertyCode}
                      onChange={(e) =>
                        handleChange("propertyCode", e.target.value)
                      }
                      placeholder="Enter property code or leave empty"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Property Type" required>
                  <select
                    value={form.propertyType}
                    onChange={(e) =>
                      handleChange("propertyType", e.target.value)
                    }
                    className={selectClass}
                  >
                    <option value="" style={optionStyle}>
                      Select property type
                    </option>
                    {PROPERTY_TYPES.map((t) => (
                      <option
                        key={t}
                        value={t}
                        style={optionStyle}
                        className="capitalize"
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Title" required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter property title"
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
                  <p className="text-white text-[10px]">Minimum 20 characters</p>
                  <p className={`text-[10px] ${descriptionTextLength < 20 ? 'text-red-400/80' : 'text-emerald-300/80'}`}>
                    {descriptionTextLength}/5000
                  </p>
                </div>
              </Field>
            </Section>

            {/* ============================= */}
            {/* SECTION: PRICING              */}
            {/* ============================= */}
            <Section icon={DollarSign} title="Pricing">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Price" required>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="Enter price"
                    className={inputClass}
                  />
                </Field>

                <Field label="Price Type">
                  <select
                    value={form.priceType}
                    onChange={(e) =>
                      handleChange("priceType", e.target.value)
                    }
                    className={selectClass}
                  >
                    {PRICE_TYPES.map((t) => (
                      <option
                        key={t}
                        value={t}
                        style={optionStyle}
                        className="capitalize"
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Currency">
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      handleChange("currency", e.target.value)
                    }
                    className={selectClass}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} style={optionStyle}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </Section>

            {/* ============================= */}
            {/* SECTION: LOCATION             */}
            {/* ============================= */}
            <Section icon={MapPin} title="Location">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Location" required>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      handleChange("location", e.target.value)
                    }
                    placeholder="Enter location"
                    className={inputClass}
                  />
                </Field>

                <Field label="City" required>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Enter city name"
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
                    placeholder="Enter area or society name"
                    className={inputClass}
                  />
                </Field>

                <Field label="Full Address">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter full address"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Latitude (Optional)" hint="For map pin">
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) =>
                      handleChange("latitude", e.target.value)
                    }
                    placeholder="Enter latitude"
                    className={inputClass}
                  />
                </Field>

                <Field label="Longitude (Optional)" hint="For map pin">
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) =>
                      handleChange("longitude", e.target.value)
                    }
                    placeholder="Enter longitude"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Section>

            {/* ============================= */}
            {/* SECTION: PROPERTY DETAILS     */}
            {/* ============================= */}
            <Section icon={Home} title="Property Details" optional>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Field label="Bedrooms">
                  <input
                    type="number"
                    value={form.bedrooms}
                    onChange={(e) =>
                      handleChange("bedrooms", e.target.value)
                    }
                    placeholder="Enter number of bedrooms"
                    className={inputClass}
                  />
                </Field>

                <Field label="Bathrooms">
                  <input
                    type="number"
                    value={form.bathrooms}
                    onChange={(e) =>
                      handleChange("bathrooms", e.target.value)
                    }
                    placeholder="Enter number of bathrooms"
                    className={inputClass}
                  />
                </Field>

                <Field label="Kitchens">
                  <input
                    type="number"
                    value={form.kitchens}
                    onChange={(e) =>
                      handleChange("kitchens", e.target.value)
                    }
                    placeholder="Enter number of kitchens"
                    className={inputClass}
                  />
                </Field>

                <Field label="Floors">
                  <input
                    type="number"
                    value={form.floors}
                    onChange={(e) =>
                      handleChange("floors", e.target.value)
                    }
                    placeholder="Enter number of floors"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Area Size">
                  <input
                    type="number"
                    value={form.areaSize}
                    onChange={(e) =>
                      handleChange("areaSize", e.target.value)
                    }
                    placeholder="Enter area size"
                    className={inputClass}
                  />
                </Field>

                <Field label="Area Unit">
                  <select
                    value={form.areaUnit}
                    onChange={(e) =>
                      handleChange("areaUnit", e.target.value)
                    }
                    className={selectClass}
                  >
                    {AREA_UNITS.map((u) => (
                      <option key={u} value={u} style={optionStyle}>
                        {u}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Year Built">
                  <input
                    type="number"
                    value={form.yearBuilt}
                    onChange={(e) =>
                      handleChange("yearBuilt", e.target.value)
                    }
                    placeholder="Enter year built"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Section>

            {/* ============================= */}
            {/* SECTION: FEATURES & AMENITIES */}
            {/* ============================= */}
            <Section icon={Layers} title="Features & Amenities" optional>
              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-white">
                    Features
                  </span>
                  <span className="text-[10px] text-white bg-white/5 px-2 py-0.5 rounded-full">
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
                          : "bg-white/3 text-white border border-white/6 hover:bg-white/6 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/4" />

              {/* Amenities */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-white">
                    Amenities
                  </span>
                  <span className="text-[10px] text-white bg-white/5 px-2 py-0.5 rounded-full">
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
                          : "bg-white/3 text-white border border-white/6 hover:bg-white/6 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-8 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange("isFeatured", !form.isFeatured)
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isFeatured ? "bg-[#2B7FFF]" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        form.isFeatured ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="text-white" />
                    <span className="text-xs text-white">Featured</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange("isPublished", !form.isPublished)
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isPublished ? "bg-[#2B7FFF]" : "bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        form.isPublished ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Eye size={12} className="text-white" />
                    <span className="text-xs text-white">Published</span>
                  </div>
                </label>
              </div>
            </Section>

            {/* ============================= */}
            {/* SECTION: IMAGES               */}
            {/* ============================= */}
            <Section icon={ImageIcon} title="Images" optional>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {imagePreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/8 group"
                  >
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={11} className="text-white" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-[#2B7FFF]/90 text-white text-[8px] font-bold rounded-md uppercase tracking-wider shadow-lg">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {images.length < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-white/8 hover:border-[#2B7FFF]/30 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/2">
                    <ImagePlus size={22} className="text-white/60 mb-1" />
                    <span className="text-[10px] text-white font-medium">
                      Add
                    </span>
                    <span className="text-[9px] text-white">
                      {images.length}/10
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-white text-[10px] mt-2">
                First image will be used as cover. Max 10 images, JPG/PNG/WebP.
              </p>
            </Section>

            {/* ============================= */}
            {/* SECTION: CONTACT INFORMATION  */}
            {/* ============================= */}
            <Section icon={Phone} title="Contact Information" optional>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Contact Name">
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
                    />
                    <input
                      type="text"
                      value={form.contactName}
                      onChange={(e) =>
                        handleChange("contactName", e.target.value)
                      }
                      placeholder="Enter contact name"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Contact Phone">
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
                    />
                    <input
                      type="tel"
                      value={form.contactPhone}
                      onChange={(e) =>
                        handleChange("contactPhone", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Contact Email">
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
                    />
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) =>
                        handleChange("contactEmail", e.target.value)
                      }
                      placeholder="Enter email address"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            {/* Bottom spacing for sticky footer */}
            <div className="h-24" />
          </form>
        </div>

        {/* ===== STICKY FOOTER ===== */}
        <div className="shrink-0 border-t border-white/6 bg-[#081730] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16 max-w-6xl mx-auto">
            <p className="text-white text-xs hidden sm:block">
              <span className="text-red-400/60">*</span> Required fields
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="propertyCreateForm"
                disabled={loading}
                className="flex items-center gap-2 px-7 py-2.5 bg-[#2B7FFF] hover:bg-[#4D94FF] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#2B7FFF]/20 hover:shadow-[#2B7FFF]/30"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating Property...
                  </>
                ) : (
                  <>
                    <Building2 size={15} />
                    Create Property
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