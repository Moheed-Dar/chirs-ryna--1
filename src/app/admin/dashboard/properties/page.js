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
  Building2,
  X,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import {
  getAllProperties,
  deleteProperty,
} from "@/lib/properties/api";
import PropertyCreateForm from "@/components/forms/PropertyCreateForm";
import PropertyUpdateForm from "@/components/forms/PropertyUpdateForm";
import PropertyDetailView from "@/components/forms/PropertyDetailView";

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

// Safe image helper
const getSafeImg = (img) => {
  if (!img) return "/placeholder.jpg";
  if (typeof img === "string" && img.trim()) return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return "/placeholder.jpg";
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewPropertyId, setViewPropertyId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const limit = 10;

  // ============================================
  // FETCH PROPERTIES
  // ============================================
  const fetchProperties = useCallback(
    async (page = 1, isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const res = await getAllProperties(page, limit, "", false, "all");
        setProperties(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setProperties([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchProperties(1);
  }, [fetchProperties]);

  // ============================================
  // REFRESH HANDLER
  // ============================================
  const handleRefresh = () => {
    fetchProperties(currentPage, true);
  };

  // ============================================
  // CLIENT-SIDE SEARCH
  // ============================================
  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propertyCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propertyType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================
  // ROW CLICK — OPEN DETAIL VIEW
  // ============================================
  const handleRowClick = (property) => {
    setViewPropertyId(property._id);
  };

  // ============================================
  // EDIT FROM DETAIL VIEW
  // ============================================
  const handleEditFromDetail = (property) => {
    setViewPropertyId(null);
    setSelectedProperty(property);
    setShowUpdateModal(true);
  };

  // ============================================
  // DELETE FROM DETAIL VIEW
  // ============================================
  const handleDeletedFromDetail = (id) => {
    setProperties((prev) => prev.filter((p) => p._id !== id));
    setViewPropertyId(null);
  };

  // ============================================
  // DELETE HANDLER (table)
  // ============================================
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    setDeleteError("");

    try {
      await deleteProperty(deleteConfirm._id);
      setProperties((prev) =>
        prev.filter((p) => p._id !== deleteConfirm._id)
      );
      setDeleteConfirm(null);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete property. Please try again.";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================
  // AFTER CREATE/UPDATE — REFRESH
  // ============================================
  const handleFormSuccess = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setSelectedProperty(null);
    fetchProperties(currentPage);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={`${inter.variable} font-(family-name:--font-inter)`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className={`text-2xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
          >
            Properties
          </h1>
          <p className="text-white/40 text-sm">
            Manage all your property listings
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* ✅ REFRESH BUTTON */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2B7FFF] hover:bg-[#4D94FF] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#2B7FFF]/25"
          >
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          placeholder="Search by title, code, city or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1b3454] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={14} className="text-white/30" />
          </button>
        )}
      </div>

      {/* Stats Bar */}
      {!loading && (
        <div className="flex items-center gap-4 mb-5">
          <span className="text-white/30 text-xs">
            Showing {filteredProperties.length} of {properties.length}{" "}
            properties
          </span>
          {searchTerm && (
            <span className="text-[#2B7FFF]/70 text-xs">
              Filtered by: &quot;{searchTerm}&quot;
            </span>
          )}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={28}
              className="animate-spin text-[#2B7FFF]/50"
            />
            <span className="text-white/25 text-xs">
              Loading properties...
            </span>
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        /* Empty */
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center mx-auto mb-4 border border-[#2B7FFF]/15">
            <Building2 size={28} className="text-[#2B7FFF]/40" />
          </div>
          <p className="text-white/40 text-sm mb-1">No properties found</p>
          <p className="text-white/20 text-xs mb-4">
            {searchTerm
              ? "Try a different search term"
              : "Create your first property listing"}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="text-[#2B7FFF] text-sm font-semibold hover:underline"
            >
              Clear search
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-[#2B7FFF] text-sm font-semibold hover:underline"
            >
              + Add Property
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-[#1b3454] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/3">
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3.5 text-center text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-4 py-3.5 text-right text-[10px] font-bold text-white/30 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {filteredProperties.map((property, index) => {
                    const imgSrc = getSafeImg(property.thumbnail);

                    return (
                      <tr
                        key={property._id}
                        /* ✅ CLICKABLE ROW */
                        onClick={() => handleRowClick(property)}
                        className="hover:bg-white/3 transition-colors group cursor-pointer"
                      >
                        <td className="px-4 py-3.5 text-white/30 text-xs">
                          {(currentPage - 1) * limit + index + 1}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                              <Image
                                src={imgSrc}
                                alt={property.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium text-sm truncate max-w-55 group-hover:text-[#2B7FFF] transition-colors">
                                {property.title}
                              </p>
                              <p className="text-white/25 text-[11px] truncate max-w-55">
                                {property.location || property.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="text-white/40 text-xs font-mono bg-white/5 px-2 py-1 rounded">
                            {property.propertyCode || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="text-white font-semibold text-sm">
                            {property.currency === "PKR" ? "Rs" : "$"}{" "}
                            {Number(property.price)?.toLocaleString()}
                          </p>
                          <p className="text-white/25 text-[10px] capitalize">
                            {property.priceType}
                          </p>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="text-white/40 text-xs capitalize">
                            {property.propertyType}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                              property.status === "available"
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                                : property.status === "sold"
                                ? "bg-red-500/15 text-red-300 border border-red-500/20"
                                : "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                            }`}
                          >
                            {property.status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          {property.isFeatured ? (
                            <span className="inline-flex items-center gap-1 text-[#2B7FFF] text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2B7FFF]" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-white/15 text-xs">
                              No
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              /* ✅ STOP PROPAGATION — don't open detail */
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProperty(property);
                                setShowUpdateModal(true);
                              }}
                              className="p-2 rounded-lg hover:bg-[#2B7FFF]/10 text-white/30 hover:text-[#2B7FFF] transition-all"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              /* ✅ STOP PROPAGATION — don't open detail */
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(property);
                                setDeleteError("");
                              }}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchProperties(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              )
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span
                      key={`d${i}`}
                      className="w-9 h-9 flex items-center justify-center text-white/20 text-sm"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => fetchProperties(item)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                        currentPage === item
                          ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/25"
                          : "border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => fetchProperties(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== CREATE MODAL ===== */}
      <AnimatePresence>
        {showCreateModal && (
          <PropertyCreateForm
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* ===== UPDATE MODAL ===== */}
      <AnimatePresence>
        {showUpdateModal && selectedProperty && (
          <PropertyUpdateForm
            property={selectedProperty}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedProperty(null);
            }}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* ===== PROPERTY DETAIL VIEW ===== */}
      <AnimatePresence>
        {viewPropertyId && (
          <PropertyDetailView
            propertyId={viewPropertyId}
            onClose={() => setViewPropertyId(null)}
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
              onClick={() => {
                if (!deleting) {
                  setDeleteConfirm(null);
                  setDeleteError("");
                }
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[#0d1f3c] rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl shadow-black/50"
            >
              {/* Red glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Icon */}
              <div className="relative w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/15">
                <Trash2 size={20} className="text-red-400" />
              </div>

              <h3
                className={`text-lg font-bold text-white mb-1.5 ${playfair.variable} font-(family-name:--font-playfair)`}
              >
                Delete Property
              </h3>

              <p className="text-white/50 text-sm mb-1">
                Are you sure you want to delete:
              </p>
              <p className="text-white font-semibold text-sm mb-1 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                {deleteConfirm.title}
              </p>
              <p className="text-white/25 text-xs mb-5">
                {deleteConfirm.propertyCode && (
                  <span className="font-mono">
                    {deleteConfirm.propertyCode}
                  </span>
                )}
                {" · "}
                {deleteConfirm.currency === "PKR" ? "Rs" : "$"}{" "}
                {Number(deleteConfirm.price)?.toLocaleString()}
              </p>

              {/* Delete Error */}
              {deleteError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/15 rounded-xl"
                >
                  <p className="text-red-400 text-xs">{deleteError}</p>
                </motion.div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setDeleteConfirm(null);
                    setDeleteError("");
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-white/60 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
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
                      <Loader2 size={15} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete
                    </>
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