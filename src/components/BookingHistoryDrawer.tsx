import React, { useState } from 'react';
import { 
  X, 
  BookmarkCheck, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Building2, 
  Utensils, 
  Trash2,
  ExternalLink,
  Database,
  RefreshCw,
  Copy,
  Check,
  Code2
} from 'lucide-react';
import { BookingSubmission } from '../types';
import { PG_INFO } from '../data/pgData';
import { formatINR, getWhatsAppBookingLink, syncBookingsWithSupabase } from '../utils/helpers';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface BookingHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingSubmission[];
  onClearBookings: () => void;
  onRefreshBookings?: () => void;
}

export const BookingHistoryDrawer: React.FC<BookingHistoryDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onClearBookings,
  onRefreshBookings,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    await syncBookingsWithSupabase();
    if (onRefreshBookings) onRefreshBookings();
    setTimeout(() => {
      setIsSyncing(false);
    }, 500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div
      id="booking-history-overlay"
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="booking-history-drawer"
        className="w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/80 font-bold">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">My PG Visits & Bookings</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>Supabase Connected</span>
                </div>
              </div>
            </div>

            <button
              id="close-history-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Supabase Actions Bar */}
          <div className="flex items-center justify-between gap-2 mb-4 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11px]">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Project ID: <span className="font-mono font-bold">jstguwjmojmojmcbsmbn</span></span>
            </div>

            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] transition-colors cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>
          </div>

          {/* Toggle SQL Helper Card */}
          <div className="mb-4">
            <button
              onClick={() => setShowSql(!showSql)}
              className="w-full py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-[11px] font-bold border border-stone-200/80 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Supabase SQL Table Schema</span>
              </div>
              <span className="text-[10px] text-amber-700 font-extrabold">{showSql ? 'Hide SQL' : 'View / Copy SQL'}</span>
            </button>

            {showSql && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>PostgreSQL DDL</span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-sans font-bold cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto max-h-40 p-2 bg-slate-900 rounded border border-slate-800/80 text-[10px] leading-relaxed text-amber-200">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            )}
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookmarkCheck className="w-12 h-12 mx-auto mb-3 text-stone-300 stroke-[1.5]" />
              <p className="text-sm font-bold text-slate-700">No scheduled visits yet</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                When you reserve a room or schedule a visit, your booking reference will appear here and sync to Supabase.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-black border border-amber-200">
                      {b.id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {b.moveInDate}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900">{b.fullName}</h4>
                    <p className="text-xs text-slate-500 font-mono font-medium">{b.phone}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1 text-slate-600 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Room:</span>
                      <span className="font-extrabold text-slate-900">
                        {b.sharing} Sharing ({b.roomType.toUpperCase()})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Food:</span>
                      <span className="font-extrabold text-slate-900">
                        {b.foodIncluded ? 'Included (+₹2,500)' : 'Room Only'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-100">
                      <span className="text-slate-500">Estimated Total:</span>
                      <span className="font-black text-slate-900 font-sans">
                        {formatINR(b.totalMonthlyRent)} / mo
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <a
                      href={getWhatsAppBookingLink({
                        fullName: b.fullName,
                        phone: b.phone,
                        roomType: b.roomType,
                        sharing: b.sharing,
                        foodIncluded: b.foodIncluded,
                        moveInDate: b.moveInDate,
                        occupation: b.occupation,
                        notes: b.notes,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                      <span>Re-send on WA</span>
                    </a>

                    <a
                      href={`tel:${PG_INFO.primaryPhone}`}
                      className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-700" />
                      <span>Call Desk</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {bookings.length > 0 && (
          <div className="pt-3.5 border-t border-stone-200 flex items-center justify-between">
            <button
              id="clear-history-btn"
              onClick={onClearBookings}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
