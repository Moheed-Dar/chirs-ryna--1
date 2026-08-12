'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  Calendar,
  Users,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MailOpen,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Inter } from 'next/font/google';
import {
  getAllContacts,
  deleteContact,
  markContactAsRead,
} from '@/lib/contact/api';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// ============================================
// STATUS CONFIG
// ============================================
const STATUS_CONFIG = {
  new: {
    label: 'New',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/25',
    icon: <Sparkles size={12} />,
  },
  readed: {
    label: 'Readed',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    icon: <MailOpen size={12} />,
  },
};

// ============================================
// HELPERS
// ============================================
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ContactsPage() {
  // ---- Data State ----
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [stats, setStats] = useState({ total: 0, read: 0, unread: 0 });

  // ---- Search ----
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimerRef = useRef(null);

  // ---- Filters ----
  const [readFilter, setReadFilter] = useState('all');

  // ---- Pagination ----
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ---- UI State ----
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success',
  });
  const [markingReadIds, setMarkingReadIds] = useState(new Set());

  // ============================================
  // DEBOUNCE SEARCH - 500ms
  // ============================================
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (searchQuery.trim() === '') {
      setDebouncedSearch('');
      setSearchLoading(false);
      setPage(0);
      return;
    }

    setSearchLoading(true);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setSearchLoading(false);
      setPage(0);
    }, 500);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  // ============================================
  // FETCH CONTACTS - Server-Side Filtering ✅
  // ============================================
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllContacts({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch,
        isRead:
          readFilter === 'all' ? '' : readFilter === 'read' ? 'true' : 'false',
      });

      if (response.success) {
        setContacts(response.data || []);
        setPagination(
          response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            limit: rowsPerPage,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
        if (response.stats) {
          setStats({
            total: response.stats.total,
            read: response.stats.read,
            unread: response.stats.unread,
          });
        }
      }
    } catch (error) {
      console.error('Fetch Contacts Error:', error);
      showSnackbar('Failed to fetch contacts', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, readFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // ============================================
  // SNACKBAR
  // ============================================
  const showSnackbar = (message, type = 'success') => {
    setSnackbar({ open: true, message, type });
    setTimeout(
      () => setSnackbar((prev) => ({ ...prev, open: false })),
      3000
    );
  };

  // ============================================
  // OPTIMISTIC MARK AS READ
  // ============================================
  const optimisticallyMarkRead = (contactId) => {
    setContacts((prev) =>
      prev.map((c) =>
        c._id === contactId
          ? { ...c, isRead: true, readAt: new Date().toISOString() }
          : c
      )
    );
    setSelectedContact((prev) =>
      prev && prev._id === contactId
        ? { ...prev, isRead: true, readAt: new Date().toISOString() }
        : prev
    );
  };

  // ============================================
  // MARK AS READ - Backend Call
  // ============================================
  const handleMarkAsRead = async (contactId, silent = false) => {
    if (markingReadIds.has(contactId)) return;
    try {
      setMarkingReadIds((prev) => new Set(prev).add(contactId));
      const response = await markContactAsRead(contactId);
      if (response.success && response.data) {
        setContacts((prev) =>
          prev.map((c) =>
            c._id === contactId ? { ...c, ...response.data } : c
          )
        );
        setSelectedContact((prev) =>
          prev && prev._id === contactId
            ? { ...prev, ...response.data }
            : prev
        );
        if (!silent) showSnackbar('Marked as read', 'success');
      } else {
        throw new Error('Backend failed');
      }
    } catch (error) {
      console.error('Mark Read Error:', error);
      if (!silent) showSnackbar('Failed to mark as read', 'error');
    } finally {
      setMarkingReadIds((prev) => {
        const next = new Set(prev);
        next.delete(contactId);
        return next;
      });
    }
  };

  // ============================================
  // VIEW CONTACT - Auto Read on Click
  // ============================================
  const handleViewContact = async (contact, e) => {
    if (e) e.stopPropagation();

    const isCurrentlyUnread = contact.isRead !== true;

    setSelectedContact(contact);
    setDetailModalOpen(true);

    if (isCurrentlyUnread) {
      optimisticallyMarkRead(contact._id);
    }

    if (isCurrentlyUnread) {
      handleMarkAsRead(contact._id, true);
    }
  };

  // ============================================
  // DELETE
  // ============================================
  const handleDeleteClick = (contact, e) => {
    if (e) e.stopPropagation();
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete?._id) return;
    try {
      const response = await deleteContact(contactToDelete._id);
      if (response.success) {
        setContacts((prev) =>
          prev.filter((c) => c._id !== contactToDelete._id)
        );
        setPagination((prev) => ({
          ...prev,
          totalRecords: prev.totalRecords - 1,
        }));
        showSnackbar('Contact deleted successfully', 'success');
        if (selectedContact?._id === contactToDelete._id) {
          setDetailModalOpen(false);
          setSelectedContact(null);
        }
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete contact', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  // ============================================
  // FILTER HELPERS
  // ============================================
  const handleReadFilterChange = (value) => {
    setReadFilter(value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setReadFilter('all');
    setPage(0);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={`${inter.variable} font-(family-name:--font-inter)`}>
      {/* ===== HEADER ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className={`text-2xl font-bold text-white ${playfair.variable} font-(family-name:--font-playfair)`}
          >
            Contacts Management
          </h1>
          <p className="text-white/40 text-sm">
            View and manage all contact form submissions
          </p>
        </div>
        <button
          onClick={fetchContacts}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => handleReadFilterChange('all')}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === 'all'
              ? 'border-[#2B7FFF] bg-[#2B7FFF]/10'
              : 'border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">All Contacts</span>
            <Users size={18} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div
          onClick={() => handleReadFilterChange('unread')}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === 'unread'
              ? 'border-[#2B7FFF] bg-[#2B7FFF]/10'
              : 'border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Unread</span>
            <Mail size={18} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {stats.unread}
          </p>
        </div>
        <div
          onClick={() => handleReadFilterChange('read')}
          className={`cursor-pointer bg-[#1b3454] border rounded-xl p-4 transition-all hover:border-[#2B7FFF]/40 ${
            readFilter === 'read'
              ? 'border-[#2B7FFF] bg-[#2B7FFF]/10'
              : 'border-white/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Read</span>
            <MailCheck size={18} className="text-white/30" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{stats.read}</p>
        </div>
      </div>

      {/* ===== SEARCH + FILTER BUTTONS ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search by name, email, phone, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b3454] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#2B7FFF]/40 focus:ring-2 focus:ring-[#2B7FFF]/10 transition-all"
          />
          {searchLoading && (
            <Loader2
              size={16}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-[#2B7FFF] animate-spin"
            />
          )}
          {searchQuery && !searchLoading && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={16} className="text-white/30" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/2 justify-start md:justify-end">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'read', label: 'Read' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => handleReadFilterChange(btn.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                readFilter === btn.key
                  ? 'bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20'
                  : 'bg-[#1b3454] text-white/60 border border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== SEARCH RESULT INFO ===== */}
      {searchQuery.trim() && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <Search size={14} className="text-[#2B7FFF]/60" />
          <span className="text-white/40 text-xs">
            Showing results for:{' '}
            <span className="text-[#2B7FFF] font-semibold">
              &quot;{searchQuery.trim()}&quot;
            </span>
          </span>
          <span className="text-white/20 text-xs">
            — {pagination.totalRecords} found
          </span>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="bg-[#1b3454] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-50">
                  Contact Info
                </th>
                {/* ✅ CHANGED: Subject hata diya, Message kar diya */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider min-w-62.5">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="w-6 h-4 bg-white/5 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/5" />
                        <div className="flex-1 space-y-1.5">
                          <div className="w-32 h-4 bg-white/5 rounded" />
                          <div className="w-24 h-3 bg-white/5 rounded" />
                          <div className="w-20 h-3 bg-white/5 rounded" />
                        </div>
                      </div>
                    </td>
                    {/* ✅ CHANGED: Skeleton width barha di message ke liye */}
                    <td className="px-4 py-3">
                      <div className="w-48 h-4 bg-white/5 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-14 h-6 bg-white/5 rounded-full" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-4 bg-white/5 rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center mx-auto mb-4 border border-[#2B7FFF]/15">
                      <MessageSquare
                        size={28}
                        className="text-[#2B7FFF]/40"
                      />
                    </div>
                    <p className="text-white/40 text-sm">No contacts found</p>
                    <p className="text-white/25 text-xs mt-1">
                      {searchQuery.trim() || readFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Contacts will appear here when users submit the form'}
                    </p>
                    {(searchQuery.trim() || readFilter !== 'all') && (
                      <button
                        onClick={handleResetFilters}
                        className="text-[#2B7FFF] text-sm font-semibold mt-2 hover:underline cursor-pointer"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                contacts.map((contact, idx) => {
                  const isUnread = contact.isRead !== true;
                  const statusKey = isUnread ? 'new' : 'readed';
                  const statusConfig =
                    STATUS_CONFIG[statusKey] || STATUS_CONFIG.new;
                  const isMarking = markingReadIds.has(contact._id);

                  return (
                    <tr
                      key={contact._id}
                      className={`hover:bg-white/5 transition-all duration-300 cursor-pointer ${
                        isUnread ? 'bg-white/3' : ''
                      }`}
                      onClick={(e) => handleViewContact(contact, e)}
                    >
                      <td className="px-4 py-3 text-white/40 text-xs">
                        {page * rowsPerPage + idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-all duration-300 ${
                                isMarking
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : isUnread
                                    ? 'bg-[#2B7FFF] text-white'
                                    : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {isMarking ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                contact.name?.charAt(0) || '?'
                              )}
                            </div>
                            {isUnread && !isMarking && (
                              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2B7FFF] rounded-full border-2 border-[#1b3454]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-sm truncate max-w-40 transition-colors duration-300 ${
                                isMarking
                                  ? 'text-emerald-300'
                                  : isUnread
                                    ? 'font-semibold text-white'
                                    : 'text-white/70'
                              }`}
                            >
                              {contact.name || 'N/A'}
                            </p>
                            <div className="text-[11px] text-white/40 truncate max-w-40">
                              <Mail size={10} className="inline mr-1" />
                              {contact.email || 'No email'}
                            </div>
                            {contact.phone && (
                              <div className="text-[11px] text-white/40 truncate max-w-40">
                                <Phone size={10} className="inline mr-1" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* ✅ CHANGED: Subject ki jagah Message aa raha hai with truncation */}
                      <td className="px-4 py-3 text-white/60 text-sm truncate max-w-62.5">
                        {contact.message || 'N/A'}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider transition-all duration-300 ${statusConfig.color} ${statusConfig.bg} border ${statusConfig.border}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="flex items-center justify-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleViewContact(contact, e)}
                            className="p-2 rounded-lg hover:bg-[#2B7FFF]/15 text-white/40 hover:text-[#2B7FFF] transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                          {isUnread && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(contact._id);
                              }}
                              disabled={isMarking}
                              className="p-2 rounded-lg hover:bg-emerald-500/15 text-white/40 hover:text-emerald-400 transition-colors disabled:opacity-40 cursor-pointer"
                              title="Mark as Read"
                            >
                              <MailCheck
                                size={20}
                                className={isMarking ? 'animate-pulse' : ''}
                              />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteClick(contact, e)}
                            className="p-2 rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Contact"
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

        {/* ===== PAGINATION ===== */}
        {!loading && contacts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/10">
            <div className="text-sm text-white/40">
              Showing {page * rowsPerPage + 1}–
              {Math.min(
                (page + 1) * rowsPerPage,
                pagination.totalRecords
              )}{' '}
              of {pagination.totalRecords}
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
                  <option key={val} value={val}>
                    {val}
                  </option>
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
                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      if (i === 0) pageNum = 1;
                      else if (i === 4) pageNum = pagination.totalPages;
                      else {
                        const mid = Math.min(
                          Math.max(page + 1, 2),
                          pagination.totalPages - 1
                        );
                        pageNum = mid + i - 2;
                      }
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum - 1)}
                        className={`w-9 h-9 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          page === pageNum - 1
                            ? 'bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages - 1, p + 1))
                  }
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

      {/* ===== CONTACT DETAIL MODAL ===== */}
      <AnimatePresence>
        {detailModalOpen && selectedContact && (
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
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 bg-[#1b3454] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full bg-linear-to-r from-[#2B7FFF] via-[#8b5cf6] to-[#2B7FFF] rounded-t-2xl" />
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold uppercase shrink-0 transition-colors duration-300 ${
                        selectedContact.isRead !== true
                          ? 'bg-[#2B7FFF] text-white shadow-lg shadow-[#2B7FFF]/20'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {selectedContact.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedContact.name || 'N/A'}
                      </h2>
                      <p className="text-sm text-white/40 mt-0.5">
                        {selectedContact.email || 'No email'}
                      </p>
                      {selectedContact.phone && (
                        <p className="text-sm text-white/40">
                          {selectedContact.phone}
                        </p>
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

                {/* Status Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider transition-all duration-300 ${
                      selectedContact.isRead === true
                        ? 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                        : 'text-blue-400 bg-blue-500/15 border border-blue-500/25'
                    }`}
                  >
                    {selectedContact.isRead === true ? (
                      <MailOpen size={12} />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    {selectedContact.isRead === true ? 'Readed' : 'New'}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                      <User
                        size={16}
                        className="text-[#2B7FFF]/60 shrink-0"
                      />
                      <div>
                        <p className="text-white/40 text-xs">Name</p>
                        <p className="text-white font-medium">
                          {selectedContact.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                      <Mail
                        size={16}
                        className="text-[#2B7FFF]/60 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-white/40 text-xs">Email</p>
                        <p className="text-white font-medium break-all">
                          {selectedContact.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                      <Phone
                        size={16}
                        className="text-[#2B7FFF]/60 shrink-0"
                      />
                      <div>
                        <p className="text-white/40 text-xs">Phone</p>
                        <p className="text-white font-medium">
                          {selectedContact.phone || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* ✅ CHANGED: Right side se Subject hata diya, sirf Date aur ReadAt */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                      <Calendar
                        size={16}
                        className="text-[#2B7FFF]/60 shrink-0"
                      />
                      <div>
                        <p className="text-white/40 text-xs">Submitted</p>
                        <p className="text-white font-medium">
                          {formatDate(selectedContact.createdAt)}
                        </p>
                      </div>
                    </div>
                    {selectedContact.readAt && (
                      <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-white/3 border border-white/5">
                        <MailCheck
                          size={16}
                          className="text-[#2B7FFF]/60 shrink-0"
                        />
                        <div>
                          <p className="text-white/40 text-xs">Read At</p>
                          <p className="text-white font-medium">
                            {formatDate(selectedContact.readAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Message Box */}
                {selectedContact.message && (
                  <div className="mt-5 p-4 bg-white/3 rounded-xl border border-white/5">
                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">
                      Message
                    </p>
                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex flex-wrap justify-end gap-3 mt-6 pt-5 border-t border-white/10">
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      setContactToDelete(selectedContact);
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DELETE DIALOG ===== */}
      <AnimatePresence>
        {deleteDialogOpen && contactToDelete && (
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
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 bg-[#1b3454] rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Delete Contact
              </h3>
              <p className="text-white/60 text-sm text-center mb-6">
                Are you sure you want to delete the contact from{' '}
                <span className="text-white font-semibold">
                  {contactToDelete.name}
                </span>
                ? This action cannot be undone.
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
                snackbar.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : snackbar.type === 'error'
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              }`}
            >
              {snackbar.type === 'success' && <Check size={18} />}
              {snackbar.type === 'error' && <AlertCircle size={18} />}
              <span className="text-sm font-medium">{snackbar.message}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}