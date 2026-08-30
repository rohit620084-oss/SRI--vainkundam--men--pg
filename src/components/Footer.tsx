import React from 'react';
import { Phone, MessageSquare, MapPin, ShieldCheck, ArrowUp, Building2, Sparkles, Clock, FileText, Home } from 'lucide-react';
import { PG_INFO, CONTACT_NUMBERS } from '../data/pgData';
import { getQuickWhatsAppLink } from '../utils/helpers';
import { TabType } from '../types';

interface FooterProps {
  onSelectTab: (tab: TabType) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (tab: TabType) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <button 
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                SV
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block group-hover:text-amber-400 transition-colors">
                  Sri Vaikundam Men's PG
                </span>
                <span className="text-[11px] text-amber-400 font-bold">
                  Sholinganallur, Chennai (OMR)
                </span>
              </div>
            </button>
            <p className="text-slate-400 leading-relaxed text-xs font-normal">
              Affordable, secure, and fully-equipped accommodation for IT professionals and college students in Sholinganallur.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified & Safe Men's Hostel</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Pages & Views</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button 
                  onClick={() => handleTabClick('home')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span>Overview & Highlights</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick('rooms')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Room Tariffs & Rent Estimator</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick('amenities')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                  <span>Amenities & Facilities</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick('food')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Food Timings & Dining Schedule</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick('rules')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>PG Rules & Notice Board</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabClick('location')} 
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Location & Contact Desk</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Desks */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Direct Contact</h4>
            <div className="space-y-2 text-xs">
              {CONTACT_NUMBERS.map((c) => (
                <div key={c.number} className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <a
                    href={`tel:${c.number}`}
                    className="hover:text-white font-mono transition-colors text-slate-300 font-medium"
                  >
                    {c.displayNumber}
                  </a>
                </div>
              ))}
              <div className="pt-2 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a
                  href={getQuickWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline font-bold"
                >
                  WhatsApp: +91 {PG_INFO.primaryPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Booking */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Hostel Location</h4>
            <p className="text-slate-400 text-xs flex items-start gap-2 leading-relaxed font-normal">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{PG_INFO.address}</span>
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all text-center cursor-pointer active:scale-95"
            >
              Schedule Visit / Book Bed
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Sri Vaikundam Men's PG, Sholinganallur, Chennai. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
