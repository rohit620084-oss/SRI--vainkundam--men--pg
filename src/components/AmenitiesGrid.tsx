import React from 'react';
import { 
  Utensils, 
  Shirt, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Bike, 
  Wifi, 
  Sparkles, 
  Flame,
  CheckCircle2,
  Check
} from 'lucide-react';
import { AMENITIES_LIST } from '../data/pgData';

// Map icon names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  Utensils,
  Shirt,
  ShieldCheck,
  Droplets,
  Zap,
  Bike,
  Wifi,
  Sparkles,
  Flame,
};

export const AmenitiesGrid: React.FC = () => {
  return (
    <section id="amenities" className="py-12 sm:py-16 bg-stone-50/60 border-b border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Modern Living Comforts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 font-sans">
            Key Amenities & Facilities
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Thoughtfully equipped with everything a working professional or student needs for a peaceful, productive, and hygienic stay in Sholinganallur.
          </p>
        </div>

        {/* 6 Key Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {AMENITIES_LIST.map((amenity) => {
            const Icon = iconMap[amenity.iconName] || Sparkles;
            const isHighlight = amenity.highlight;

            return (
              <div
                key={amenity.id}
                id={`amenity-card-${amenity.id}`}
                className="p-5 sm:p-6 rounded-3xl transition-all duration-200 flex flex-col justify-between border bg-white border-stone-200 hover:border-amber-300 hover:shadow-md shadow-sm"
              >
                <div>
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-slate-700 text-[11px] font-bold border border-stone-200">
                      {amenity.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                    {amenity.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {amenity.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-amber-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Maintained 24x7</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional PG Highlights Ribbon */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Check className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">Attached Baths</div>
                <div className="text-[11px] text-slate-500 font-medium">Western fittings</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Check className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">Wardrobes</div>
                <div className="text-[11px] text-slate-500 font-medium">Personal lock & key</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Check className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">Open Terrace</div>
                <div className="text-[11px] text-slate-500 font-medium">Fresh air & drying</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                <Check className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">Daily Housekeeping</div>
                <div className="text-[11px] text-slate-500 font-medium">Clean corridors & room</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
