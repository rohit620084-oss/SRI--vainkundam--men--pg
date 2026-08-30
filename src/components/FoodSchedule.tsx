import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Clock, 
  Coffee, 
  Soup, 
  UtensilsCrossed, 
  Check, 
  HeartHandshake, 
  ShieldCheck,
  Sparkles,
  Flame
} from 'lucide-react';
import { FOOD_SCHEDULE, PG_INFO } from '../data/pgData';
import { getMealStatus } from '../utils/helpers';

const mealIcons: Record<string, React.ElementType> = {
  Coffee,
  Soup,
  UtensilsCrossed,
};

export const FoodSchedule: React.FC = () => {
  const [mealStatus, setMealStatus] = useState(getMealStatus());

  useEffect(() => {
    // Refresh status every 60 seconds
    const interval = setInterval(() => {
      setMealStatus(getMealStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="food" className="py-12 sm:py-16 bg-white border-b border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-3">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>3-Times Fresh & Homely Meals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 font-sans">
            Food Timings & Dining Schedule
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Prepared fresh daily with high-quality ingredients, pure RO water for cooking, and authentic home-style flavors to keep you healthy and energized.
          </p>

          {/* Live Kitchen Status Indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs shadow-xs">
            <span className="flex h-2.5 w-2.5 relative">
              {mealStatus.isOpen && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  mealStatus.isOpen ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span className="font-extrabold text-slate-900">{mealStatus.statusText}</span>
            <span className="text-stone-300 font-bold">|</span>
            <span className="text-slate-500 font-medium">Chennai Time (IST)</span>
          </div>
        </div>

        {/* 3 Food Timing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {FOOD_SCHEDULE.map((meal) => {
            const Icon = mealIcons[meal.iconName] || Coffee;
            const isCurrentlyServing = mealStatus.activeMealId === meal.id;

            return (
              <div
                key={meal.id}
                id={`food-card-${meal.id}`}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
                  isCurrentlyServing
                    ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-stone-50/70 border-stone-200 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Meal Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    {isCurrentlyServing ? (
                      <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300 animate-pulse">
                        Serving Now
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-600 text-[11px] font-bold border border-stone-200">
                        {meal.tag}
                      </span>
                    )}
                  </div>

                  {/* Meal Name & Time Badge */}
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">{meal.name}</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-amber-800 text-xs font-black border border-stone-200 shadow-2xs mb-3">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{meal.timeWindow}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                    {meal.description}
                  </p>

                  {/* Sample Menu Items */}
                  <div className="space-y-1.5 pt-3 border-t border-stone-200/70">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Sample Menu:
                    </div>
                    {meal.sampleMenu.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Served Piping Hot
                  </span>
                  <span className="font-extrabold text-slate-800">Unlimited Quantity</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Food Hygiene & Quality Commitment Banner */}
        <div className="rounded-3xl bg-stone-50/70 border border-stone-200 p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60 font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-0.5">RO Purified Cooking</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Every meal and drinking water is prepared using strictly 100% RO filtered water.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60 font-bold">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-0.5">Homely & Less Oily</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Nutritious, digestive, and less oily food prepared without artificial preservatives.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60 font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-0.5">Affordable Add-on</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Only ₹2,500/month extra for all 3 meals daily. Choose food or room-only anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
