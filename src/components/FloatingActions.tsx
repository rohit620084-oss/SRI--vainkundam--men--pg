import React from 'react';
import { Phone, MessageSquare, CalendarCheck, Lock } from 'lucide-react';
import { PG_INFO } from '../data/pgData';
import { getQuickWhatsAppLink } from '../utils/helpers';

interface FloatingActionsProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenBooking, onOpenAdmin }) => {
  return (
    <>
      {/* Desktop & Tablet Floating Actions (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-end gap-2.5">
        {/* Discreet Owner Lock Button */}
        <button
          id="floating-desktop-admin-btn"
          onClick={onOpenAdmin}
          className="group flex items-center gap-2 p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-slate-400 hover:text-amber-400 border border-slate-800 shadow-md transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
          title="PG Owner / Admin Portal"
        >
          <Lock className="w-4 h-4" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-[11px] font-bold tracking-wide px-0 group-hover:px-1 text-slate-200">
            Owner Portal
          </span>
        </button>

        {/* Floating WhatsApp Button */}
        <a
          id="floating-desktop-whatsapp-btn"
          href={getQuickWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/20 hover:scale-105 transition-all active:scale-95 font-bold"
          title="Chat with Manager on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-black tracking-wide px-0 group-hover:px-1">
            WhatsApp Support
          </span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
          </span>
        </a>
      </div>

      {/* Mobile Bottom Sticky Action Bar (High Conversion) */}
      <div
        id="mobile-bottom-action-bar"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 p-2 px-3 shadow-2xl safe-area-bottom"
      >
        <div className="flex items-center justify-between gap-1.5 max-w-md mx-auto">
          {/* Quick Admin Lock Button */}
          <button
            id="mobile-sticky-admin-btn"
            onClick={onOpenAdmin}
            className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-amber-700 font-bold border border-stone-200 flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
            title="Owner Portal"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Quick Call */}
          <a
            id="mobile-sticky-call-btn"
            href={`tel:${PG_INFO.primaryPhone}`}
            className="flex-1 py-2.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-extrabold text-xs border border-stone-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-slate-700" />
            <span>Call</span>
          </a>

          {/* WhatsApp */}
          <a
            id="mobile-sticky-whatsapp-btn"
            href={getQuickWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-2 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Schedule Visit Primary Button */}
          <button
            id="mobile-sticky-book-btn"
            onClick={onOpenBooking}
            className="flex-[1.4] py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-slate-950" />
            <span>Reserve Bed</span>
          </button>
        </div>
      </div>
    </>
  );
};
