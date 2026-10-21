"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Search,
  Loader2,
  Trash2,
  RefreshCw,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSubscribers, deleteSubscriber } from "@/lib/subscribers/api";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20,
  });
  const [refreshing, setRefreshing] = useState(false);

  // ---- Delete states ----
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ============================================
  // FETCH SUBSCRIBERS
  // ============================================
  const fetchSubscribers = useCallback(
    async (currentPage = page, currentSearch = search, showLoader = true) => {
      if (showLoader) setLoading(true);
      setError("");

      const res = await getSubscribers({
        page: currentPage,
        limit: 20,
        search: currentSearch,
      });

      if (res.success) {
        setSubscribers(res.data?.subscribers || []);
        setPagination(res.data?.pagination || {});
      } else {
        setError(res.message || "Failed to fetch subscribers");
      }

      if (showLoader) setLoading(false);
    },
    [page, search]
  );

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  // ============================================
  // SEARCH (debounced)
  // ============================================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  // ============================================
  // DELETE HANDLER
  // ============================================
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const res = await deleteSubscriber(deleteTarget._id);

    if (res.success) {
      setSuccessMsg(res.message || "Subscriber deleted successfully");
      setTimeout(() => setSuccessMsg(""), 4000);
      setDeleteTarget(null);
      fetchSubscribers(page, search, false);
    } else {
      setError(res.message || "Failed to delete subscriber");
    }

    setDeleting(false);
  };

  // ============================================
  // HELPERS
  // ============================================
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubscribers(page, search, false);
    setTimeout(() => setRefreshing(false), 600);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div>
      {/* ===== HEADER ROW ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
            <Mail size={16} className="text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Subscribers</h3>
            <p className="text-white/30 text-[11px]">
              {pagination.totalCount || 0} newsletter subscribers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or email..."
              className="w-full bg-[#0f2240] border border-white/8 rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* ===== SUCCESS MESSAGE ===== */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5"
          >
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <p className="text-emerald-300 text-xs">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ERROR MESSAGE ===== */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/15 rounded-xl flex items-center gap-2.5"
          >
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <p className="text-red-300 text-xs flex-1">{error}</p>
            <button
              onClick={() => setError("")}
              className="shrink-0 p-0.5 hover:bg-red-500/20 rounded-lg"
            >
              <X size={13} className="text-red-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={26} className="animate-spin text-[#2B7FFF]/50" />
        </div>
      ) : subscribers.length === 0 ? (
        /* ===== EMPTY STATE ===== */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/3 flex items-center justify-center mb-4">
            <Users size={24} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm font-medium">
            {search ? "No subscribers found" : "No subscribers yet"}
          </p>
          <p className="text-white/20 text-xs mt-1">
            {search
              ? `No results for "${search}"`
              : "Newsletter subscriptions will appear here"}
          </p>
        </div>
      ) : (
        <>
          {/* ===== TABLE ===== */}
          <div className="overflow-x-auto rounded-xl border border-white/6">
            <table className="w-full min-w-150">
              <thead>
                <tr className="bg-[#0f2240] border-b border-white/6">
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    Subscribed On
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => (
                  <motion.tr
                    key={sub._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/4r:bg-white/[0.02] transition-colors"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2B7FFF]/10 border border-[#2B7FFF]/20 flex items-center justify-center shrink-0">
                          <span className="text-[#2B7FFF] text-xs font-bold uppercase">
                            {sub.name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium truncate max-w-45">
                          {sub.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="text-white/60 text-sm truncate block max-w-60">
                        {sub.email}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <span className="text-white/40 text-xs">
                        {formatDate(sub.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-xs font-medium transition-all cursor-pointer"
                        title="Delete subscriber"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== PAGINATION ===== */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-white/30 text-xs">
                Page {pagination.currentPage} of {pagination.totalPages} •{" "}
                {pagination.totalCount} total
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:bg-white/5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1b3454] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle size={18} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm mb-1">
                    Delete Subscriber?
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed">
                    You&apos;re about to permanently delete{" "}
                    <span className="text-white/70 font-medium">
                      {deleteTarget.name}
                    </span>{" "}
                    ({deleteTarget.email}). This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-white/60 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}