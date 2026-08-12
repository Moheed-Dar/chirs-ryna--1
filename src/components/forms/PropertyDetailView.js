"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  DollarSign,
  Home,
  Bed,
  Bath,
  Maximize,
  Layers,
  Star,
  Eye,
  Calendar,
  Hash,
  Tag,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPropertyById, deleteProperty } from "@/lib/properties/api";

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

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getImg = (img) => {
  if (!img) return "/placeholder.jpg";
  if (typeof img === "string" && img.trim()) return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return "/placeholder.jpg";
};

// ============================================
// INFO ROW
// ============================================
function InfoRow({ icon: Icon, label, value, mono }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/4 last:border-0">
      <Icon size={14} className="text-white/25 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-white/25 text-[10px] uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p
          className={`text-white/80 text-sm mt-0.5 wrap-break-word ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertyDetailView({
  propertyId,
  onClose,
  onEdit,
  onDeleted,
}) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ============================================
  // FETCH PROPERTY
  // ============================================
  useEffect(() => {
    if (!propertyId) return;
    setLoading(true);
    setError("");
    setActiveImage(0);

    getPropertyById(propertyId)
      .then((res) => {
        const data = res.data || res.property || res;
        setProperty(data);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load property");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propertyId]);

  // ============================================
  // IMAGES
  // ============================================
  const images = property?.images
    ? property.images.map((img) => getImg(img))
    : property?.thumbnail
    ? [getImg(property.thumbnail)]
    : [];

  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // ============================================
  // COPY CODE
  // ============================================
  const copyCode = () => {
    if (!property?.propertyCode) return;
    navigator.clipboard.writeText(property.propertyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================
  // DELETE
  // ============================================
  const handleDelete = async () => {
    if (!property) return;
    setDeleting(true);
    setDeleteError("");

    try {
      await deleteProperty(property._id);
      onDeleted?.(property._id);
      onClose();
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-[#081730] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#2B7FFF]/50" />
            <span className="text-white/25 text-sm">Loading property...</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error || !property) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-[#081730] flex items-center justify-center p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <p className="text-red-400 text-sm mb-3">{error || "Property not found"}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/10 text-white/50 text-sm rounded-xl hover:bg-white/5 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ============================================
  // DETAIL VIEW
  // ============================================
  const p = property;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-9999 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-[#081730] flex flex-col shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER ===== */}
        <div className="shrink-0 border-b border-white/6 bg-[#081730]">
          <div className="flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-2.5">
              <Building2 size={16} className="text-[#2B7FFF]" />
              <span className="text-sm font-semibold text-white">Property Details</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white/40" />
            </button>
          </div>
        </div>

        {/* ===== SCROLLABLE CONTENT ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain will-change-transform">
          {/* ---- IMAGE GALLERY ---- */}
          {images.length > 0 && (
            <div className="relative">
              <div className="relative aspect-16/10 bg-black/30">
                <Image
                  src={images[activeImage]}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 672px) 100vw, 672px"
                  priority
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={18} className="text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                    >
                      <ChevronRight size={18} className="text-white" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 rounded-lg text-white text-[11px] font-medium">
                    {activeImage + 1} / {images.length}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
                      p.status === "available"
                        ? "bg-emerald-500/90 text-white"
                        : p.status === "sold"
                        ? "bg-red-500/90 text-white"
                        : "bg-blue-500/90 text-white"
                    }`}
                  >
                    {p.status || "N/A"}
                  </span>
                </div>

                {/* Featured Badge */}
                {p.isFeatured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-[#2B7FFF]/90 rounded-lg">
                    <Star size={10} className="text-white fill-white" />
                    <span className="text-white text-[10px] font-bold uppercase">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-1.5 p-3 bg-black/20 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        i === activeImage
                          ? "border-[#2B7FFF] opacity-100"
                          : "border-transparent opacity-40 hover:opacity-70"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- CONTENT ---- */}
          <div className="p-6 space-y-6">
            {/* Title + Code */}
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                {p.title}
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {p.propertyCode && (
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    title="Click to copy"
                  >
                    <Hash size={11} className="text-white/30" />
                    <span className="text-white/50 text-xs font-mono">
                      {p.propertyCode}
                    </span>
                    {copied ? (
                      <Check size={11} className="text-emerald-400" />
                    ) : (
                      <Copy size={11} className="text-white/20" />
                    )}
                  </button>
                )}
                {p.propertyType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#2B7FFF]/10 border border-[#2B7FFF]/20 rounded-lg">
                    <Building2 size={11} className="text-[#2B7FFF]" />
                    <span className="text-[#2B7FFF] text-xs capitalize font-medium">
                      {p.propertyType}
                    </span>
                  </span>
                )}
                {p.isPublished !== false && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <Eye size={11} className="text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-medium">
                      Published
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="bg-white/3 rounded-xl border border-white/6 p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {p.currency === "PKR" ? "Rs" : p.currency || "$"}
                </span>
                <span className="text-2xl font-bold text-white">
                  {Number(p.price)?.toLocaleString()}
                </span>
                {p.priceType && (
                  <span className="text-white/30 text-sm capitalize ml-1">
                    / {p.priceType}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {p.description && (
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                  Description
                </h4>
                {/* ✅ FIXED: Replaced plain text with dangerouslySetInnerHTML for Rich Text */}
                <div 
                  className="text-white/60 text-sm leading-relaxed overflow-hidden break-words
                             [&_p]:my-2 [&_div]:my-2 
                             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 
                             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 
                             [&_li]:ml-2 [&_li]:my-1 
                             [&_h1]:text-base [&_h1]:font-bold [&_h1]:my-2 [&_h1]:text-white
                             [&_h2]:text-sm [&_h2]:font-bold [&_h2]:my-2 [&_h2]:text-white
                             [&_blockquote]:border-l-4 [&_blockquote]:border-[#2B7FFF] [&_blockquote]:pl-4 [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(p.description) || "No description available." }}
                />
              </div>
            )}

            {/* Location */}
            <div>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                Location
              </h4>
              <div className="bg-white/3 rounded-xl border border-white/6 p-4 space-y-0">
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value={p.location}
                />
                <InfoRow icon={Building2} label="City" value={p.city} />
                <InfoRow icon={MapPin} label="Area / Society" value={p.area} />
                <InfoRow icon={MapPin} label="Address" value={p.address} />
                {p.latitude && p.longitude && (
                  <InfoRow
                    icon={MapPin}
                    label="Coordinates"
                    value={`${p.latitude}, ${p.longitude}`}
                    mono
                  />
                )}
              </div>
            </div>

            {/* Property Specs */}
            <div>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                Property Details
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    icon: Bed,
                    label: "Bedrooms",
                    value: p.bedrooms,
                  },
                  {
                    icon: Bath,
                    label: "Bathrooms",
                    value: p.bathrooms,
                  },
                  {
                    icon: Home,
                    label: "Kitchens",
                    value: p.kitchens,
                  },
                  {
                    icon: Layers,
                    label: "Floors",
                    value: p.floors,
                  },
                ].map(({ icon: Ic, label, value }) => (
                  <div
                    key={label}
                    className="bg-white/3 rounded-xl border border-white/6 p-3 text-center"
                  >
                    <Ic size={16} className="text-white/20 mx-auto mb-1.5" />
                    <p className="text-white font-bold text-lg">
                      {value || 0}
                    </p>
                    <p className="text-white/25 text-[10px] uppercase tracking-wider">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3">
                {p.areaSize > 0 && (
                  <div className="bg-white/3 rounded-xl border border-white/6 p-3 text-center">
                    <Maximize
                      size={16}
                      className="text-white/20 mx-auto mb-1.5"
                    />
                    <p className="text-white font-bold text-lg">
                      {p.areaSize}
                    </p>
                    <p className="text-white/25 text-[10px] uppercase tracking-wider">
                      {p.areaUnit || "sqft"}
                    </p>
                  </div>
                )}
                {p.yearBuilt && (
                  <div className="bg-white/3 rounded-xl border border-white/6 p-3 text-center">
                    <Calendar
                      size={16}
                      className="text-white/20 mx-auto mb-1.5"
                    />
                    <p className="text-white font-bold text-lg">
                      {p.yearBuilt}
                    </p>
                    <p className="text-white/25 text-[10px] uppercase tracking-wider">
                      Year Built
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {p.features?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                  Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {p.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#2B7FFF]/10 text-[#2B7FFF] border border-[#2B7FFF]/20 rounded-lg text-xs font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {p.amenities?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                  Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {p.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                Contact Information
              </h4>
              <div className="bg-white/3 rounded-xl border border-white/6 p-4 space-y-0">
                <InfoRow
                  icon={User}
                  label="Name"
                  value={p.contactName || p.addedBy?.name}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={p.contactPhone || p.addedBy?.phone}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={p.contactEmail || p.addedBy?.email}
                />
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                Record Info
              </h4>
              <div className="bg-white/3 rounded-xl border border-white/6 p-4 space-y-0">
                <InfoRow
                  icon={Calendar}
                  label="Created"
                  value={
                    p.createdAt
                      ? new Date(p.createdAt).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="Last Updated"
                  value={
                    p.updatedAt
                      ? new Date(p.updatedAt).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"
                  }
                />
              </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-24" />
          </div>
        </div>

        {/* ===== STICKY FOOTER ===== */}
        <div className="shrink-0 border-t border-white/6 bg-[#081730] shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          {deleteConfirm ? (
            /* Delete Confirm */
            <div className="px-6 py-4">
              <p className="text-red-300 text-sm mb-3">
                Are you sure you want to delete this property?
              </p>
              {deleteError && (
                <p className="text-red-400 text-xs mb-3 bg-red-500/10 px-3 py-2 rounded-lg">
                  {deleteError}
                </p>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setDeleteConfirm(false);
                    setDeleteError("");
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-white/50 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Actions */
            <div className="flex items-center justify-between px-6 h-16">
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>

              <button
                onClick={() => onEdit?.(property)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#2B7FFF] hover:bg-[#4D94FF] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#2B7FFF]/20"
              >
                <Edit size={14} />
                Edit Property
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}