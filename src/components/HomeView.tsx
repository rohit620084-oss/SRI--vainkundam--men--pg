import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Clock, 
  FileText, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Shirt, 
  CheckCircle2, 
  Phone, 
  MessageSquare,
  UtensilsCrossed
} from 'lucide-react';
import { Hero } from './Hero';
import { FAQSection } from './FAQSection';
import { PG_INFO } from '../data/pgData';
import { getQuickWhatsAppLink } from '../utils/helpers';
import { TabType } from '../types';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenBooking: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenBooking }) => {
  const quickCards = [
    {
      id: 'rooms' as TabType,
      title: 'Room Tariffs & Estimator',
      subtitle: 'Single, 2, 3 & 4 Sharing Options',
      priceTag: 'From ₹3,500/mo',
      badge: 'AC & Non-AC',
      icon: Building2,
      description: 'Customizable monthly tariffs with attached washroom options, storage wardrobes, and rent calculation.',
    },
    {
      id: 'amenities' as TabType,
      title: 'Amenities & Facilities',
      subtitle: 'Modern & Comfortable Living',
      priceTag: 'Included Free',
      badge: '10+ Facilities',
      icon: Sparkles,
      description: 'High-speed Wi-Fi, 24/7 power backup, RO drinking water, automatic washing machine, and CCTV security.',
    },
    {
      id: 'food' as TabType,
      title: 'Food Timings & Dining',
      subtitle: '3-Times Homely South & North Meals',
      priceTag: 'Optional (+₹2.5k)',
      badge: 'Hot & Fresh',
      icon: Clock,
      description: 'Daily breakfast, lunch, and dinner timetable with nutritious home-style cooking and weekend specials.',
    },
    {
      id: 'rules' as TabType,
      title: 'PG Rules & Notice Board',
      subtitle: 'Peaceful & Safe Environment',
      priceTag: 'Transparent Policy',
      badge: 'Verified Code',
      icon: FileText,
      description: 'Clear guidelines on entry timings, visitor regulations, deposit notice period, and cleanliness standards.',
    },
    {
      id: 'location' as TabType,
      title: 'Location & Nearby IT Parks',
      subtitle: 'Sholinganallur, Chennai (OMR)',
      priceTag: 'Walkable to ELCOT',
      badge: 'Prime Hub',
      icon: MapPin,
      description: 'Direct proximity to TCS, Infosys, Wipro, HCL, Cognizant, and major Sholinganallur bus stops.',
    },
  ];

  const highlights = [
    { label: 'Zero Brokerage', desc: 'Direct owner contact with zero extra middleman fees', icon: CheckCircle2 },
    { label: '24/7 Security & CCTV', desc: 'Continuous surveillance and safe residential zone', icon: ShieldCheck },
    { label: 'Homely Dining Plan', desc: 'Fresh 3-times food made in hygienic in-house kitchen', icon: UtensilsCrossed },
    { label: 'High-Speed Wi-Fi', desc: 'Seamless connectivity for WFH and online study', icon: Zap },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <Hero
        onOpenBooking={onOpenBooking}
        onNavigateToRooms={() => onNavigate('rooms')}
      />

      {/* Quick Action Navigation Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-black border border-amber-200 mb-2">
              <span>Quick Navigation Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              Explore Hostel Features by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-medium">
              Click any section below to switch directly to its dedicated page and view full details.
            </p>
          </div>
        </div>

        {/* 5-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group relative bg-white border border-stone-200/90 hover:border-amber-400 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200/60 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 group-hover:bg-amber-100/70 text-slate-800 text-[11px] font-black border border-stone-200 group-hover:border-amber-200 transition-colors">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-800 transition-colors font-sans">
                    {card.title}
                  </h3>
                  <p className="text-xs text-amber-700 font-bold mt-0.5">
                    {card.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 font-sans">
                    {card.priceTag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 group-hover:translate-x-1 transition-transform">
                    <span>View Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Direct Reservation Callout */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 mb-4">
                Instant Visit Booking
              </span>
              <h3 className="text-lg font-black text-white font-sans">
                Ready to Check Out the PG?
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
                Lock your monthly tariff and schedule an in-person room visit without paying any advance deposit.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Reserve Bed / Schedule Visit</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              Why Stay at Sri Vaikundam Men's PG?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Designed for hassle-free living close to your workplace and college
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div
                  key={h.label}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{h.label}</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Desk Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 text-slate-950 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950/10 text-slate-950 text-xs font-black mb-2">
              <span>Direct Warden & Booking Helpline</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
              Have Questions or Want Directions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-semibold mt-1">
              Speak directly with our hostel desk or message us on WhatsApp for live photo/video tour.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${PG_INFO.primaryPhone}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-black text-xs hover:bg-slate-800 transition-colors shadow-sm font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call {PG_INFO.primaryPhone}</span>
            </a>

            <a
              href={getQuickWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-black text-xs hover:bg-emerald-50 transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <FAQSection />
    </div>
  );
};
