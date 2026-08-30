import React from 'react';
import { ArrowLeft, Home, Building2, Sparkles, Clock, FileText, MapPin, ChevronRight } from 'lucide-react';
import { TabType } from '../types';

interface PageViewHeaderProps {
  currentTab: TabType;
  title: string;
  badge: string;
  description: string;
  onNavigate: (tab: TabType) => void;
}

export const PageViewHeader: React.FC<PageViewHeaderProps> = ({
  currentTab,
  title,
  badge,
  description,
  onNavigate,
}) => {
  const allTabs: { id: TabType; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', name: 'Overview', icon: Home },
    { id: 'rooms', name: 'Rooms & Tariffs', icon: Building2 },
    { id: 'amenities', name: 'Amenities', icon: Sparkles },
    { id: 'food', name: 'Food Timings', icon: Clock },
    { id: 'rules', name: 'Rules & Guidelines', icon: FileText },
    { id: 'location', name: 'Location & Map', icon: MapPin },
  ];

  return (
    <div className="bg-stone-100/90 border-b border-stone-200 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Back to Home */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-amber-700 font-bold transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">{title}</span>
          </div>

          <button
            id="back-to-home-btn"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-slate-800 text-xs font-bold border border-stone-200/90 shadow-2xs transition-all cursor-pointer hover:border-amber-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-600" />
            <span>Back to Home Overview</span>
          </button>
        </div>

        {/* Page Title & Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-black border border-amber-200 mb-2">
              <span>{badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              {description}
            </p>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {allTabs
              .filter((t) => t.id !== 'home' && t.id !== currentTab)
              .map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => onNavigate(t.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-amber-800 text-xs font-bold border border-stone-200/80 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.name}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
