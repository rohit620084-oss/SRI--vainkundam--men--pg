import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Building2,
  Utensils,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Database,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Briefcase,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { BookingSubmission, RoomType, SharingType } from '../types';
import { 
  formatINR, 
  syncBookingsWithSupabase, 
  updateBookingStatus, 
  deleteBookingItem, 
  getOwnerFollowUpWhatsAppLink 
} from '../utils/helpers';
import { PG_INFO } from '../data/pgData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onBookingsUpdated?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  onBookingsUpdated,
}) => {
  const [bookings, setBookings] = useState<BookingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Load bookings from local + Supabase
  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await syncBookingsWithSupabase();
      setBookings(data);
      if (onBookingsUpdated) onBookingsUpdated();
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: BookingSubmission['status']) => {
    const updated = await updateBookingStatus(id, newStatus);
    setBookings(updated);
    if (onBookingsUpdated) onBookingsUpdated();
    showToast(`Status updated to "${newStatus}"`);
  };

  // Handle delete
  const handleDeleteBooking = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete inquiry ${id}? This action cannot be undone.`)) {
      setDeletingId(id);
      const updated = await deleteBookingItem(id);
      setBookings(updated);
      setDeletingId(null);
      if (onBookingsUpdated) onBookingsUpdated();
      showToast(`Inquiry ${id} deleted successfully`);
    }
  };

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 3000);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert('No booking records available to export.');
      return;
    }

    const headers = [
      'Booking ID',
      'Date Created',
      'Full Name',
      'Phone',
      'Room Type',
      'Sharing',
      'Food Included',
      'Occupation',
      'Company/College',
      'Move-in Date',
      'Monthly Rent',
      'Status',
      'Notes'
    ];

    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${new Date(b.createdAt).toLocaleDateString('en-IN')}"`,
      `"${b.fullName.replace(/"/g, '""')}"`,
      `"${b.phone}"`,
      `"${b.roomType.toUpperCase()}"`,
      `"${b.sharing} Sharing"`,
      `"${b.foodIncluded ? 'Yes' : 'No'}"`,
      `"${(b.occupation || '').replace(/"/g, '""')}"`,
      `"${(b.companyOrCollege || '').replace(/"/g, '""')}"`,
      `"${b.moveInDate || ''}"`,
      `"${b.totalMonthlyRent}"`,
      `"${b.status}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sri-vaikundam-pg-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick stats calculations
  const totalCount = bookings.length;
  const pendingVisitsCount = bookings.filter(
    (b) => b.status === 'Visit Scheduled' || b.status === 'Pending Review'
  ).length;
  
  const todayStr = new Date().toDateString();
  const todayInquiriesCount = bookings.filter((b) => {
    const d = new Date(b.createdAt);
    return d.toDateString() === todayStr;
  }).length;

  const confirmedCount = bookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'Checked-in'
  ).length;

  // Filtered list
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      (b.companyOrCollege && b.companyOrCollege.toLowerCase().includes(q)) ||
      (b.occupation && b.occupation.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && (b.status === 'Visit Scheduled' || b.status === 'Pending Review')) ||
      (statusFilter === 'confirmed' && (b.status === 'Confirmed' || b.status === 'Checked-in')) ||
      (statusFilter === 'visited' && b.status === 'Visited') ||
      (statusFilter === 'cancelled' && b.status === 'Cancelled') ||
      b.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesRoom =
      roomFilter === 'all' ||
      (roomFilter === 'ac' && b.roomType === 'ac') ||
      (roomFilter === 'non-ac' && b.roomType === 'non-ac') ||
      (roomFilter === '1-sharing' && b.sharing === 1) ||
      (roomFilter === '2-sharing' && b.sharing === 2) ||
      (roomFilter === '3-sharing' && b.sharing === 3) ||
      (roomFilter === '4-sharing' && b.sharing === 4);

    return matchesSearch && matchesStatus && matchesRoom;
  });

  const getStatusBadge = (status: BookingSubmission['status']) => {
    switch (status) {
      case 'Confirmed':
      case 'Checked-in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>{status}</span>
          </span>
        );
      case 'Visited':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
            <Sparkles className="w-3 h-3 text-blue-700" />
            <span>Visited</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-700" />
            <span>Cancelled</span>
          </span>
        );
      case 'Pending Review':
      case 'Visit Scheduled':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>{status || 'Visit Scheduled'}</span>
          </span>
        );
    }
  };

  return (
    <div
      id="admin-dashboard-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="admin-dashboard-card"
        className="w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Owner Management Dashboard</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-800">
                  <Database className="w-2.5 h-2.5" />
                  <span>Supabase Live</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Sri Vaikundam Men's PG • Sholinganallur, Chennai</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="admin-refresh-btn"
              onClick={loadBookings}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              title="Refresh and sync data from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Sync Supabase'}</span>
            </button>

            <button
              id="admin-export-btn"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer"
              title="Export all inquiries to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors cursor-pointer"
              title="Lock Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>

            <button
              id="admin-dashboard-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Success Toast Banner */}
        {actionSuccessMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shrink-0 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-100 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/50">
          
          {/* Quick Stats Grid (3 Primary Cards + 1 Bonus) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Total Bookings */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Total Inquiries</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">{totalCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">All time submissions</div>
            </div>

            {/* Card 2: Pending Visits */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200/80 bg-amber-50/30 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900">Pending Visits</span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 font-sans">{pendingVisitsCount}</div>
              <div className="text-[11px] text-amber-700/90 mt-0.5">Need follow-up call/walkthrough</div>
            </div>

            {/* Card 3: Today's Inquiries */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 bg-emerald-50/30 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900">Today's Inquiries</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-sans">{todayInquiriesCount}</div>
              <div className="text-[11px] text-emerald-700/90 mt-0.5">Received today</div>
            </div>

            {/* Card 4: Confirmed / Allotted */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Confirmed Beds</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">{confirmedCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Reserved / Checked-in</div>
            </div>
          </div>

          {/* Controls Bar (Search, Status Filter, Room Filter) */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Guest Name, Phone, Ref ID, Company..."
                className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Tabs / Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs font-bold">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 shadow-2xs font-black'
                      : 'text-amber-800 hover:text-amber-950'
                  }`}
                >
                  Pending ({pendingVisitsCount})
                </button>
                <button
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    statusFilter === 'confirmed'
                      ? 'bg-emerald-600 text-white shadow-2xs font-black'
                      : 'text-emerald-800 hover:text-emerald-950'
                  }`}
                >
                  Confirmed ({confirmedCount})
                </button>
              </div>

              {/* Room Filter Dropdown */}
              <select
                id="admin-room-filter"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Room Types</option>
                <option value="ac">AC Rooms Only</option>
                <option value="non-ac">Non-AC Rooms Only</option>
                <option value="1-sharing">1 Sharing</option>
                <option value="2-sharing">2 Sharing</option>
                <option value="3-sharing">3 Sharing</option>
                <option value="4-sharing">4 Sharing</option>
              </select>
            </div>
          </div>

          {/* Bookings List / Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No matching bookings found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                  {searchQuery || statusFilter !== 'all' || roomFilter !== 'all'
                    ? 'Try adjusting your search query or filters to view other inquiries.'
                    : 'When prospective tenants submit visit requests through the website, their details will appear here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-slate-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-stone-200">
                      <th className="py-3.5 px-4">Ref ID / Date</th>
                      <th className="py-3.5 px-4">Guest Details</th>
                      <th className="py-3.5 px-4">Direct Contact</th>
                      <th className="py-3.5 px-4">Room & Meal</th>
                      <th className="py-3.5 px-4">Move-in / Rent</th>
                      <th className="py-3.5 px-4">Status & Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-slate-700">
                    {filteredBookings.map((b) => {
                      const followUpWhatsApp = getOwnerFollowUpWhatsAppLink(b);
                      const isDeleting = deletingId === b.id;

                      return (
                        <tr
                          key={b.id}
                          className="hover:bg-amber-50/30 transition-colors group"
                        >
                          {/* Col 1: Ref ID & Date */}
                          <td className="py-4 px-4 align-top">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {b.id}
                              </span>
                              <button
                                onClick={() => handleCopyId(b.id)}
                                title="Copy Reference ID"
                                className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                              >
                                {copiedId === b.id ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-600 mt-1 font-mono">
                              {new Date(b.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </td>

                          {/* Col 2: Guest Details */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-black text-slate-900 text-sm">{b.fullName}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{b.occupation}</span>
                              {b.companyOrCollege && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-700 font-bold">{b.companyOrCollege}</span>
                                </>
                              )}
                            </div>
                            {b.notes && (
                              <div className="mt-1.5 p-1.5 rounded-lg bg-stone-100 text-[10px] text-slate-600 leading-tight border border-stone-200/60 max-w-xs">
                                <strong>Note:</strong> {b.notes}
                              </div>
                            )}
                          </td>

                          {/* Col 3: Direct Contact (Call & WhatsApp) */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-mono font-bold text-slate-900 text-xs mb-1.5">
                              +91 {b.phone}
                            </div>
                            <div className="flex items-center gap-1.5">
                              {/* Direct Phone Call */}
                              <a
                                href={`tel:${b.phone}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-[11px] border border-stone-200 transition-colors"
                                title="Call prospective guest"
                              >
                                <Phone className="w-3 h-3 text-slate-600" />
                                <span>Call</span>
                              </a>

                              {/* Follow-up WhatsApp */}
                              <a
                                href={followUpWhatsApp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors"
                                title="Send official confirmation & walkthrough WhatsApp message"
                              >
                                <MessageSquare className="w-3 h-3 fill-current" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </td>

                          {/* Col 4: Room & Meal */}
                          <td className="py-4 px-4 align-top">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{b.sharing} Sharing ({b.roomType.toUpperCase()})</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] mt-1">
                              <Utensils className="w-3 h-3 text-slate-400 shrink-0" />
                              {b.foodIncluded ? (
                                <span className="text-emerald-700 font-bold">3 Meals Included</span>
                              ) : (
                                <span className="text-slate-500">Room Only (No Food)</span>
                              )}
                            </div>
                          </td>

                          {/* Col 5: Move-in & Rent */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-black text-slate-900 text-xs">
                              {formatINR(b.totalMonthlyRent)}
                              <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>Visit: <strong className="text-slate-800">{b.moveInDate || 'Immediate'}</strong></span>
                            </div>
                          </td>

                          {/* Col 6: Status & Controls */}
                          <td className="py-4 px-4 align-top">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(b.status)}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Quick Status Updater */}
                              <select
                                value={b.status}
                                onChange={(e) =>
                                  handleStatusChange(b.id, e.target.value as BookingSubmission['status'])
                                }
                                className="py-1 px-2 rounded-lg bg-stone-50 border border-stone-200 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                              >
                                <option value="Visit Scheduled">Visit Scheduled</option>
                                <option value="Pending Review">Pending Review</option>
                                <option value="Visited">Visited</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Checked-in">Checked-in</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                disabled={isDeleting}
                                title="Delete inquiry"
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Helpful Tips Card for Owner */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-bold">Pro-Tip for PG Operations:</strong>
                <span className="text-amber-900/90 font-medium">
                  Click the green <strong>"WhatsApp"</strong> button next to any prospective guest to send a pre-formatted invitation with directions and PG address automatically!
                </span>
              </div>
            </div>
            <a
              href={`https://supabase.com/dashboard/project/jstguwjmojmojmcbsmbn`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors"
            >
              <span>Open Supabase Cloud</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
