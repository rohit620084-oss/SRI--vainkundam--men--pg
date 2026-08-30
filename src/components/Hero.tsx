import React from 'react';
import { 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Shirt, 
  ArrowRight, 
  CalendarCheck, 
  Phone, 
  MapPin, 
  Utensils, 
  CheckCircle2, 
  Star,
  Sparkles,
  Wifi
} from 'lucide-react';
import { PG_INFO } from '../data/pgData';

interface HeroProps {
  onOpenBooking: () => void;
  onNavigateToRooms: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onNavigateToRooms }) => {
  const featureTags = [
    { label: "24/7 CCTV", icon: ShieldCheck },
    { label: "RO Filter Water", icon: Droplets },
    { label: "24hr Electricity", icon: Zap },
    { label: "Washing Machine", icon: Shirt },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16 bg-stone-50/60 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xl border border-slate-800">
            {/* Subtle Warm Amber / Indigo Radial Glow */}
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10">
              {/* Top Location & Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 text-amber-300 rounded-full text-xs font-extrabold tracking-wider uppercase mb-5 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Sholinganallur, Chennai (OMR IT Corridor)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 font-sans">
                Safe, Secure & Homely Living <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">
                  in the heart of OMR IT Hub
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl font-normal">
                Premium AC & Non-AC rooms crafted for IT professionals and college students. Includes 3-times hygienic homely food, 24/7 security, high-speed Wi-Fi, and daily housekeeping.
              </p>

              {/* Feature Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-8">
                {featureTags.map((tag) => {
                  const Icon = tag.icon;
                  return (
                    <div
                      key={tag.label}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs font-semibold backdrop-blur-sm"
                    >
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="leading-tight truncate">{tag.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  id="hero-schedule-visit-btn"
                  onClick={onOpenBooking}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 transition-all cursor-pointer group active:scale-95"
                >
                  <CalendarCheck className="w-4 h-4 text-slate-950" />
                  <span>Reserve Bed</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-view-tariffs-btn"
                  onClick={onNavigateToRooms}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <span>View Tariffs</span>
                  <span className="text-xs text-amber-400 font-mono font-bold">from ₹3,500</span>
                </button>

                <a
                  id="hero-quick-call-btn"
                  href={`tel:${PG_INFO.primaryPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-colors font-mono"
                  title={`Call ${PG_INFO.primaryPhone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span className="sm:hidden lg:inline">{PG_INFO.primaryPhone}</span>
                </a>
              </div>
            </div>

            {/* Quick Micro Trust Footer */}
            <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800/80 w-full">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero Brokerage
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Guest Stay from ₹400/day
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Minimal Deposit
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Highlights & Quick Glance Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
              
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 mb-4">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Tariffs At A Glance
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Monthly sharing rates (AC & Non-AC)</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Transparent
                  </span>
                </div>

                {/* Quick Pricing Grid Preview */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                        1
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">1 Sharing (Single)</div>
                        <div className="text-[10px] text-slate-500">Full Privacy & Attached Bath</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-600">₹8,000 <span className="text-[10px] text-slate-400 font-normal">AC</span></div>
                      <div className="text-[11px] text-slate-600 font-mono">₹6,000 Non-AC</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                        2
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">2 Sharing (Twin)</div>
                        <div className="text-[10px] text-slate-500">Spacious & Balanced Comfort</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-600">₹7,000 <span className="text-[10px] text-slate-400 font-normal">AC</span></div>
                      <div className="text-[11px] text-slate-600 font-mono">₹5,000 Non-AC</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">3 Sharing (Triple)</div>
                        <div className="text-[10px] text-slate-500">Lockable Wardrobes & Desk</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-600">₹6,000 <span className="text-[10px] text-slate-400 font-normal">AC</span></div>
                      <div className="text-[11px] text-slate-600 font-mono">₹4,000 Non-AC</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                        4
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">4 Sharing (Saver)</div>
                        <div className="text-[10px] text-slate-500">Super Economical & Friendly</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-600">₹5,000 <span className="text-[10px] text-slate-400 font-normal">AC</span></div>
                      <div className="text-[11px] text-slate-600 font-mono">₹3,500 Non-AC</div>
                    </div>
                  </div>
                </div>

                {/* Food Add-on Callout */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 mb-4 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-amber-950 block">Homely 3-Times Food: +₹2,500/mo extra</span>
                    <span className="text-[11px] text-amber-800 font-medium">Breakfast, Lunch & Dinner available with any room variant.</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                id="hero-card-calculate-btn"
                onClick={onNavigateToRooms}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Open Interactive Rent Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
