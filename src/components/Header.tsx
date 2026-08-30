import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  CalendarCheck, 
  Building2, 
  Sparkles, 
  Clock, 
  FileText, 
  MapPin, 
  BookmarkCheck,
  Home
} from 'lucide-react';
import { PG_INFO } from '../data/pgData';
import { getQuickWhatsAppLink } from '../utils/helpers';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenBooking: (prefill?: { sharing?: 1 | 2 | 3 | 4; roomType?: 'ac' | 'non-ac'; foodIncluded?: boolean }) => void;
  onOpenHistory: () => void;
  savedBookingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onSelectTab, 
  onOpenBooking, 
  onOpenHistory, 
  savedBookingsCount 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: TabType; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', name: 'Overview', icon: Home },
    { id: 'rooms', name: 'Rooms & Tariffs', icon: Building2 },
    { id: 'amenities', name: 'Amenities', icon: Sparkles },
    { id: 'food', name: 'Food Timings', icon: Clock },
    { id: 'rules', name: 'PG Rules', icon: FileText },
    { id: 'location', name: 'Location & Nearby', icon: MapPin },
  ];

  const handleTabClick = (tab: TabType) => {
    setMobileMenuOpen(false);
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Notification / Urgency Bar */}
      <div className="bg-slate-950 border-b border-slate-850 text-xs text-slate-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Admissions Open 2025–2026
            </span>
            <span className="hidden sm:inline text-slate-300 text-xs font-normal">
              AC & Non-AC Sharing Rooms in Sholinganallur near OMR IT Hubs
            </span>
            <span className="sm:hidden text-slate-300 text-xs">Sholinganallur, Chennai (OMR)</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              id="top-quick-call-link"
              href={`tel:${PG_INFO.primaryPhone}`}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{PG_INFO.primaryPhone}</span>
            </a>
            {savedBookingsCount > 0 && (
              <button
                id="header-my-bookings-btn"
                onClick={onOpenHistory}
                className="hidden md:inline-flex items-center gap-1 text-slate-200 hover:text-white transition-colors bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700 text-[11px] font-medium"
              >
                <BookmarkCheck className="w-3 h-3 text-amber-400" />
                <span>My Bookings ({savedBookingsCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-stone-200/80 ${
          isScrolled ? 'shadow-sm shadow-slate-900/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand Logo & Name */}
            <button 
              onClick={() => handleTabClick('home')} 
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-amber-400 font-black text-base md:text-lg shadow-sm group-hover:bg-slate-800 transition-colors border border-slate-850">
                SV
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black tracking-tight text-slate-900 text-base md:text-lg">
                    Sri Vaikundam <span className="text-amber-600">Men's PG</span>
                  </span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                  Sholinganallur, Chennai (OMR)
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-stone-100/70 p-1.5 rounded-2xl border border-stone-200/60">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => handleTabClick(link.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-sm border border-stone-200/90 text-amber-950 font-black'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 font-semibold'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Header Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {/* WhatsApp Quick Link */}
              <a
                id="header-whatsapp-btn"
                href={getQuickWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              {/* Call Button */}
              <a
                id="header-call-btn"
                href={`tel:${PG_INFO.primaryPhone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-black text-slate-800 bg-stone-100 hover:bg-stone-200 rounded-xl border border-stone-200 transition-colors font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>{PG_INFO.primaryPhone}</span>
              </a>

              {/* Primary Schedule CTA */}
              <button
                id="header-schedule-visit-btn"
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer active:scale-95"
              >
                <CalendarCheck className="w-4 h-4 text-slate-950" />
                <span>Reserve Bed</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                id="mobile-schedule-quick-btn"
                onClick={() => onOpenBooking()}
                className="sm:hidden inline-flex items-center gap-1 px-3 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl shadow-sm"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Reserve</span>
              </button>

              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2"
          >
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleTabClick(link.id)}
                    className={`flex items-center justify-between w-full px-3.5 py-3 text-left text-sm rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-amber-50 text-amber-950 font-black border border-amber-200/80 shadow-2xs' 
                        : 'text-slate-700 hover:bg-stone-50 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-500'} shrink-0`} />
                      <span>{link.name}</span>
                    </div>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-[11px] font-black text-amber-900">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {savedBookingsCount > 0 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHistory();
                }}
                className="flex items-center justify-between w-full px-3.5 py-2.5 text-sm font-bold text-amber-900 bg-amber-50/80 border border-amber-200 rounded-xl"
              >
                <span className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-amber-600" />
                  View Saved Bookings
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-xs font-black text-amber-900">
                  {savedBookingsCount}
                </span>
              </button>
            )}

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <button
                id="mobile-menu-book-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-center flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Reserve Bed / Schedule Visit</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  id="mobile-drawer-call-btn"
                  href={`tel:${PG_INFO.primaryPhone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs border border-stone-200"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Call {PG_INFO.primaryPhone}</span>
                </a>

                <a
                  id="mobile-drawer-whatsapp-btn"
                  href={getQuickWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
