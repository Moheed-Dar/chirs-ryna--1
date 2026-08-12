'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Trash2,
  Eye,
  MailCheck,
  RefreshCw,
  X,
  Phone,
  Mail,
  User,
  Home,
  Calendar,
  Users,
  FileDown,
  Sparkles,
  MessageSquare,
  Star,
  Check,
  XCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  MailOpen,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import {
  getAllLeads,
  getLeadById,
  deleteLead,
  markLeadAsRead,
} from "@/lib/leads/api";

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

// ============================================
// CONSTANTS
// ============================================
const STATUS_CONFIG = {
  new: {
    label: "New",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/25",
    icon: <Sparkles size={12} />,
  },
  readed: {
    label: "Readed",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    icon: <MailOpen size={12} />,
  },
  contacted: {
    label: "Contacted",
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-500/25",
    icon: <MessageSquare size={12} />,
  },
  qualified: {
    label: "Qualified",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/25",
    icon: <Check size={12} />,
  },
  converted: {
    label: "Converted",
    color: "text-indigo-400",
    bg: "bg-indigo-500/15",
    border: "border-indigo-500/25",
    icon: <Star size={12} />,
  },
  lost: {
    label: "Lost",
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/25",
    icon: <XCircle size={12} />,
  },
};

const SOURCE_CONFIG = {
  website: { label: "Website", color: "text-blue-400" },
  facebook: { label: "Facebook", color: "text-indigo-400" },
  instagram: { label: "Instagram", color: "text-pink-400" },
  google: { label: "Google", color: "text-emerald-400" },
  referral: { label: "Referral", color: "text-amber-400" },
  direct: { label: "Direct", color: "text-gray-400" },
  whatsapp: { label: "WhatsApp", color: "text-emerald-400" },
  call: { label: "Call", color: "text-orange-400" },
  email: { label: "Email", color: "text-blue-400" },
};

// ============================================
// HELPERS
// ============================================
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getLeadTypeDisplay = (lead) => {
  if (lead.leadType === "guide_download") {
    if (lead.guideType === "buyer") {
      return {
        label: "Buyer Guide",
        icon: <BookOpen size={12} />,
        color: "text-cyan-400",
        bg: "bg-cyan-500/15",
        border: "border-cyan-500/25",
      };
    }
    if (lead.guideType === "seller") {
      return {
        label: "Seller Guide",
        icon: <BookOpen size={12} />,
        color: "text-amber-400",
        bg: "bg-amber-500/15",
        border: "border-amber-500/25",
      };
    }
    return {
      label: "Guide Download",
      icon: <FileDown size={12} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/25",
    };
  }

  return {
    label: "Property Inquiry",
    icon: <Home size={12} />,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/25",
  };
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [readFilter, setReadFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [leadTypeFilter, setLeadTypeFilter] = useState("all");
  const [guideTypeFilter, setGuideTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedLead, setSelectedLead] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [markingReadIds, setMarkingReadIds] = useState(new Set());
  const [modalLoading, setModalLoading] = useState(false);

  // ✅ NEW: Global Stats State (Database se aayega)
  const [globalStats, setGlobalStats] = useState({
    allLeads: 0,
    propertyInquiries: 0,
    buyerGuides: 0,
    sellerGuides: 0,
  });

  // Derive single value for Type Dropdown
  const currentTypeFilterValue = useMemo(() => {
    if (leadTypeFilter === "guide_download" && guideTypeFilter === "buyer") return "buyer_guide";
    if (leadTypeFilter === "guide_download" && guideTypeFilter === "seller") return "seller_guide";
    if (leadTypeFilter === "property_inquiry") return "property_inquiry";
    return "all";
  }, [leadTypeFilter, guideTypeFilter]);

  // ---- Debounce Search ----
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ---- Fetch ----
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      };

      if (statusFilter !== "all") params.status = statusFilter;
      if (sourceFilter !== "all") params.source = sourceFilter;
      if (leadTypeFilter !== "all") params.leadType = leadTypeFilter;
      if (guideTypeFilter !== "all") params.guideType = guideTypeFilter;

      const response = await getAllLeads(params);

      if (response.success) {
        setLeads(response.data);
        setPagination(response.pagination);
        
        // ✅ NEW: Set Global Stats from Backend
        if (response.stats) {
          setGlobalStats(response.stats);
        }
      }
    } catch (error) {
      console.error("Fetch Leads Error:", error);
      showSnackbar("Failed to fetch leads", "error");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, sourceFilter, leadTypeFilter, guideTypeFilter, sortBy, sortOrder]);
  
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handler for Type Filter Dropdown & Cards
  const handleTypeFilterChange = (val) => {
    const value = val?.target ? val.target.value : val;
    if (value === "all") {
      setLeadTypeFilter("all");
      setGuideTypeFilter("all");
    } else if (value === "property_inquiry") {
      setLeadTypeFilter("property_inquiry");
      setGuideTypeFilter("all");
    } else if (value === "buyer_guide") {
      setLeadTypeFilter("guide_download");
      setGuideTypeFilter("buyer");
    } else if (value === "seller_guide") {
      setLeadTypeFilter("guide_download");
      setGuideTypeFilter("seller");
    }
    setPage(0);
  };

  // ---- Client-side filtering ----
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (readFilter === "read") {
      result = result.filter((l) => l.isRead === true);
    } else if (readFilter === "unread") {
      result = result.filter((l) => l.isRead !== true);
    }

    if (debouncedSearch.trim() !== "") {
      const query = debouncedSearch.toLowerCase();
      result = result.filter((l) =>
        (l.name && l.name.toLowerCase().includes(query)) ||
        (l.email && l.email.toLowerCase().includes(query)) ||
        (l.phone && l.phone.toLowerCase().includes(query)) ||
        (l.property?.title && l.property.title.toLowerCase().includes(query)) ||
        (l.property?.propertyCode && l.property.propertyCode.toLowerCase().includes(query))
      );
    }

    return result;
  }, [leads, readFilter, debouncedSearch]);

  // ✅ UPDATED: Counts (Sirf Client-side Read/Unread ke liye)
  const counts = useMemo(() => {
    const read = leads.filter(l => l.isRead === true).length;
    const unread = leads.filter(l => l.isRead !== true).length;
    return { read, unread };
  }, [leads]);

  // ---- Snackbar ----
  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  // ---- Handlers ----
  const handleViewLead = async (lead, e) => {
    if (e) e.stopPropagation();
    try {
      setModalLoading(true);
      const response = await getLeadById(lead._id);
      const leadData = response.success ? response.data : lead;
      setSelectedLead(leadData);
      setDetailModalOpen(true);
      if (!leadData.isRead) {
        handleMarkAsRead(leadData._id, true);
      }
    } catch (error) {
      console.error("View Lead Error:", error);
      setSelectedLead(lead);
      setDetailModalOpen(true);
      showSnackbar("Showing cached data", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleMarkAsRead = async (leadId, silent = false) => {
    if (markingReadIds.has(leadId)) return;
    try {
      setMarkingReadIds((prev) => new Set(prev).add(leadId));
      const response = await markLeadAsRead(leadId);
      if (response.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l._id === leadId
              ? { ...l, isRead: true, readAt: new Date().toISOString() }
              : l
          )
        );
        setSelectedLead((prev) => {
          if (prev && prev._id === leadId) {
            return { ...prev, isRead: true, readAt: new Date().toISOString() };
          }
          return prev;
        });
        if (!silent) {
          showSnackbar("Marked as read", "success");
        }
      }
    } catch (error) {
      console.error("Mark Read Error:", error);
      if (!silent) showSnackbar("Failed to mark as read", "error");
    } finally {
      setMarkingReadIds((prev) => {
        const next = new Set(prev);
        next.delete(leadId);
        return next;
      });
    }
  };

  const handleDeleteClick = (lead, e) => {
    if (e) e.stopPropagation();
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete?._id) return;
    try {
      const response = await deleteLead(leadToDelete._id);
      if (response.success) {
        setLeads((prev) => prev.filter((l) => l._id !== leadToDelete._id));
        setPagination((prev) => ({ ...prev, totalRecords: prev.totalRecords - 1 }));
        showSnackbar("Lead deleted successfully", "success");
        if (selectedLead?._id === leadToDelete._id) {
          setDetailModalOpen(false);
          setSelectedLead(null);
        }
        fetchLeads(); // Stats refresh ke liye
      }
    } catch (error) {
      showSnackbar(error.message || "Failed to delete lead", "error");
    } finally {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setReadFilter("all");
    handleTypeFilterChange("all");
    setPage(0);
  };

  // ---- Render ----
  return (
    <div className={`${inter.variable} font-(family-name:--font-inter)`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}>
            Leads Management
          </h1>
          <p className="text-white/40 text-sm">Manage and track all your leads from various sources</p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ===== 6 CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        
        {/* All Leads (Global Total) */}
        <div
          onClick={() => { setReadFilter("all"); handleTypeFilterChange("all"); setPage(0); }}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === "all" && currentTypeFilterValue === "all" ? "border-[#2B7FFF] bg-[#2B7FFF]/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs truncate">All Leads</span>
            <Users size={16} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{globalStats.allLeads}</p>
        </div>

        {/* Unread (Client-side) */}
        <div
          onClick={() => { setReadFilter("unread"); setPage(0); }}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === "unread" ? "border-[#2B7FFF] bg-[#2B7FFF]/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs truncate">Unread</span>
            <Mail size={16} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{counts.unread}</p>
        </div>

        {/* Read (Client-side) */}
        <div
          onClick={() => { setReadFilter("read"); setPage(0); }}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === "read" ? "border-[#2B7FFF] bg-[#2B7FFF]/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs truncate">Read</span>
            <MailCheck size={16} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{counts.read}</p>
        </div>

        {/* Property Inquiry (Global Total) */}
        <div
          onClick={() => handleTypeFilterChange("property_inquiry")}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-blue-500/40 ${
            currentTypeFilterValue === "property_inquiry" ? "border-blue-500 bg-blue-500/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs truncate">Property</span>
            <Home size={16} className="text-blue-400/60" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{globalStats.propertyInquiries}</p>
        </div>

        {/* Buyer Guide (Global Total) */}
        <div
          onClick={() => handleTypeFilterChange("buyer_guide")}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-cyan-500/40 ${
            currentTypeFilterValue === "buyer_guide" ? "border-cyan-500 bg-cyan-500/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs truncate">Buyer Guide</span>
            <BookOpen size={16} className="text-cyan-400/60" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{globalStats.buyerGuides}</p>
        </div>

        {/* Seller Guide (Global Total) */}
        <div
          onClick={() => handleTypeFilterChange("seller_guide")}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-amber-500/40 ${
            currentTypeFilterValue === "seller_guide" ? "border-amber-500 bg-amber-500/10" : "border-white/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs truncate">Seller Guide</span>
            <BookOpen size={16} className="text-amber-400/60" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{globalStats.sellerGuides}</p>
        </div>
      </div>

      {/* ===== Search + Filter Buttons ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or property code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full bg-[#1b3454] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} className="text-white/30" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-1/2 justify-start md:justify-end flex-wrap">
          <button
            onClick={() => { setReadFilter("all"); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              readFilter === "all"
                ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                : "bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setReadFilter("unread"); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              readFilter === "unread"
                ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                : "bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => { setReadFilter("read"); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              readFilter === "read"
                ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                : "bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Read
          </button>

          {/* Type Filter Dropdown */}
          <select
            value={currentTypeFilterValue}
            onChange={(e) => handleTypeFilterChange(e)}
            className="bg-[#1b3454] border border-white/10 rounded-xl px-4 py-2 text-sm font-semibold text-white/60 focus:outline-none focus:border-[#2B7FFF]/40 cursor-pointer hover:border-white/20 hover:text-white transition-all"
          >
            <option value="all">All Types</option>
            <option value="property_inquiry">Property Inquiry</option>
            <option value="buyer_guide">Buyer Guide</option>
            <option value="seller_guide">Seller Guide</option>
          </select>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="bg-[#1b3454] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-12">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-50">Lead Info</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-40">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-35">Property Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-30">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="w-6 h-4 bg-white/5 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/5" />
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-white/5 rounded" />
                          <div className="w-24 h-3 bg-white/5 rounded mt-1" />
                          <div className="w-20 h-3 bg-white/5 rounded mt-1" />
                        </div>
                      </div>
                    </td>
                    <td><div className="w-24 h-4 bg-white/5 rounded" /></td>
                    <td><div className="w-28 h-4 bg-white/5 rounded" /></td>
                    <td><div className="w-20 h-5 bg-white/5 rounded" /></td>
                    <td><div className="w-14 h-6 bg-white/5 rounded-full" /></td>
                    <td><div className="w-16 h-5 bg-white/5 rounded" /></td>
                    <td><div className="w-24 h-4 bg-white/5 rounded" /></td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center mx-auto mb-4 border border-[#2B7FFF]/15">
                      <Users size={28} className="text-[#2B7FFF]/40" />
                    </div>
                    <p className="text-white/40 text-sm">No leads found</p>
                    <p className="text-white/25 text-xs mt-1">
                      {debouncedSearch || readFilter !== "all" || currentTypeFilterValue !== "all"
                        ? "Try adjusting your search or filters"
                        : "Leads will appear here when customers submit inquiries"}
                    </p>
                    {(debouncedSearch || readFilter !== "all" || currentTypeFilterValue !== "all") && (
                      <button onClick={handleResetFilters} className="text-[#2B7FFF] text-sm font-semibold mt-2 hover:underline cursor-pointer">
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, idx) => {
                  const isUnread = !lead.isRead;
                  const statusKey = isUnread ? "new" : "readed";
                  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.new;
                  const sourceConfig = SOURCE_CONFIG[lead.source] || { label: lead.source || "N/A", color: "text-gray-400" };
                  const leadTypeDisplay = getLeadTypeDisplay(lead);

                  return (
                    <tr
                      key={lead._id}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${isUnread ? "bg-white/3" : ""}`}
                      onClick={(e) => handleViewLead(lead, e)}
                    >
                      <td className="px-4 py-3 text-white/40 text-xs">{page * rowsPerPage + idx + 1}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold uppercase ${isUnread ? "bg-[#2B7FFF] text-white" : "bg-white/10 text-white/40"}`}>
                              {lead.name?.charAt(0) || "?"}
                            </div>
                            {isUnread && (
                              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2B7FFF] rounded-full border-2 border-[#1b3454]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm truncate max-w-40 ${isUnread ? "font-semibold text-white" : "text-white/70"}`}>
                              {lead.name || "N/A"}
                            </p>
                            <div className="text-[11px] text-white/40 truncate max-w-40">
                              <Mail size={10} className="inline mr-1" />
                              {lead.email || "No email"}
                            </div>
                            {lead.phone && (
                              <div className="text-[11px] text-white/40 truncate max-w-40">
                                <Phone size={10} className="inline mr-1" />
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-white/70 text-sm truncate max-w-40">
                        {lead.property?.title || "N/A"}
                      </td>

                      <td className="px-4 py-3">
                        {lead.property?.propertyCode ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-[#2B7FFF]/10 text-[#2B7FFF] border border-[#2B7FFF]/20">
                            <Hash size={11} className="shrink-0" />
                            {lead.property.propertyCode}
                          </span>
                        ) : (
                          <span className="text-xs text-white/20">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${leadTypeDisplay.color} ${leadTypeDisplay.bg} border ${leadTypeDisplay.border}`}>
                          {leadTypeDisplay.icon}
                          {leadTypeDisplay.label}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusConfig.color} ${statusConfig.bg} border ${statusConfig.border}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`text-xs ${sourceConfig.color}`}>{sourceConfig.label}</span>
                      </td>

                      <td className="px-4 py-3 text-white/40 text-xs">{formatDate(lead.createdAt)}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleViewLead(lead, e)}
                            className="p-2 rounded-lg hover:bg-[#2B7FFF]/15 text-white/40 hover:text-[#2B7FFF] transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>

                          {isUnread && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(lead._id);
                              }}
                              disabled={markingReadIds.has(lead._id)}
                              className="p-2 rounded-lg hover:bg-emerald-500/15 text-white/40 hover:text-emerald-400 transition-colors disabled:opacity-40 cursor-pointer"
                              title="Mark as Read"
                            >
                              <MailCheck size={20} className={markingReadIds.has(lead._id) ? "animate-pulse" : ""} />
                            </button>
                          )}

                          <button
                            onClick={(e) => handleDeleteClick(lead, e)}
                            className="p-2 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Pagination ===== */}
        {!loading && filteredLeads.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/10">
            <div className="text-sm text-white/40">
              Showing {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, pagination.totalRecords)} of {pagination.totalRecords}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                className="bg-[#1b3454] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/60 focus:outline-none focus:border-[#2B7FFF]/40 cursor-pointer"
              >
                {[5, 10, 25, 50].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] hover:bg-[#2B7FFF]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    if (i === 0) pageNum = 1;
                    else if (i === 4) pageNum = pagination.totalPages;
                    else {
                      const mid = Math.min(Math.max(page, 1), pagination.totalPages - 2);
                      pageNum = mid + i - 1;
                    }
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum - 1)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        page === pageNum - 1
                          ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages - 1, p + 1))}
                  disabled={page >= pagination.totalPages - 1}
                  className="w-9 h-9 rounded-full border border-white/10 text-white/40 hover:border-[#2B7FFF]/50 hover:text-[#2B7FFF] hover:bg-[#2B7FFF]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== LEAD DETAIL MODAL ===== */}
      <AnimatePresence>
        {detailModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDetailModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 bg-[#1b3454] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full bg-linear-to-r from-[#2B7FFF] via-[#8b5cf6] to-[#2B7FFF] rounded-t-2xl" />

              {modalLoading ? (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="w-40 h-5 bg-white/5 rounded animate-pulse" />
                      <div className="w-52 h-4 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : selectedLead ? (
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold uppercase shrink-0 ${!selectedLead.isRead ? "bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20" : "bg-white/10 text-white/40"}`}>
                        {selectedLead.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedLead.name || "N/A"}</h2>
                        <p className="text-sm text-white/40 mt-0.5">{selectedLead.email || "No email"}</p>
                        {selectedLead.phone && (
                          <p className="text-sm text-white/40">{selectedLead.phone}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setDetailModalOpen(false)}
                      className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                    >
                      <X size={20} className="text-white/50" />
                    </button>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${STATUS_CONFIG[selectedLead.status]?.color || "text-white"} ${STATUS_CONFIG[selectedLead.status]?.bg || "bg-white/10"} border ${STATUS_CONFIG[selectedLead.status]?.border || "border-white/10"}`}>
                      {STATUS_CONFIG[selectedLead.status]?.icon}
                      {STATUS_CONFIG[selectedLead.status]?.label || selectedLead.status || "N/A"}
                    </span>
                    <span className={`text-xs ${SOURCE_CONFIG[selectedLead.source]?.color || "text-gray-400"}`}>
                      {SOURCE_CONFIG[selectedLead.source]?.label || selectedLead.source || "N/A"}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${selectedLead.isRead ? "text-gray-400 bg-gray-500/10 border border-gray-500/20" : "text-blue-400 bg-blue-500/15 border border-blue-500/25"}`}>
                      <MailCheck size={12} />
                      {selectedLead.isRead ? "Readed" : "New"}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                        <User size={16} className="text-[#2B7FFF]/60 shrink-0" />
                        <div>
                          <p className="text-white/40 text-xs">Name</p>
                          <p className="text-white font-medium">{selectedLead.name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                        <Mail size={16} className="text-[#2B7FFF]/60 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white/40 text-xs">Email</p>
                          <p className="text-white font-medium break-all">{selectedLead.email || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                        <Phone size={16} className="text-[#2B7FFF]/60 shrink-0" />
                        <div>
                          <p className="text-white/40 text-xs">Phone</p>
                          <p className="text-white font-medium">{selectedLead.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                        <Home size={16} className="text-[#2B7FFF]/60 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white/40 text-xs">Property</p>
                          <p className="text-white font-medium truncate">{selectedLead.property?.title || "N/A"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                        <Hash size={16} className="text-[#2B7FFF]/60 shrink-0" />
                        <div>
                          <p className="text-white/40 text-xs">Property Code</p>
                          {selectedLead.property?.propertyCode ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg bg-[#2B7FFF]/10 text-[#2B7FFF] border border-[#2B7FFF]/20 mt-0.5">
                              {selectedLead.property.propertyCode}
                            </span>
                          ) : (
                            <p className="text-white/40 font-medium mt-0.5">N/A</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                        <Calendar size={16} className="text-[#2B7FFF]/60 shrink-0" />
                        <div>
                          <p className="text-white/40 text-xs">Created</p>
                          <p className="text-white font-medium">{formatDate(selectedLead.createdAt)}</p>
                        </div>
                      </div>

                      {selectedLead.readAt && (
                        <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                          <MailCheck size={16} className="text-[#2B7FFF]/60 shrink-0" />
                          <div>
                            <p className="text-white/40 text-xs">Read At</p>
                            <p className="text-white font-medium">{formatDate(selectedLead.readAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  {selectedLead.message && (
                    <div className="mt-5 p-4 bg-white/3 rounded-xl border border-white/5">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Message</p>
                      <p className="text-white/80 text-sm leading-relaxed">{selectedLead.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-white/10">
                    {!selectedLead.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(selectedLead._id)}
                        disabled={markingReadIds.has(selectedLead._id)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer border border-emerald-500/20"
                      >
                        <MailCheck size={16} className={markingReadIds.has(selectedLead._id) ? "animate-pulse" : ""} />
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDetailModalOpen(false);
                        setLeadToDelete(selectedLead);
                        setDeleteDialogOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer border border-red-500/20"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <button
                      onClick={() => setDetailModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm font-semibold cursor-pointer border border-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DELETE DIALOG ===== */}
      <AnimatePresence>
        {deleteDialogOpen && leadToDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDeleteDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative z-10 bg-[#1b3454] rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Delete Lead</h3>
              <p className="text-white/60 text-sm text-center mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">{leadToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-sm font-semibold cursor-pointer border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold flex items-center gap-2 cursor-pointer border border-red-500/25"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SNACKBAR ===== */}
      <AnimatePresence>
        {snackbar.open && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
                snackbar.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" :
                snackbar.type === "error" ? "bg-red-500/20 border border-red-500/30 text-red-400" :
                "bg-blue-500/20 border border-blue-500/30 text-blue-400"
              }`}
            >
              {snackbar.type === "success" && <Check size={18} />}
              {snackbar.type === "error" && <AlertCircle size={18} />}
              <span className="text-sm font-medium">{snackbar.message}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}