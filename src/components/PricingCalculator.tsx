import React, { useState } from 'react';
import { 
  Building2, 
  Check, 
  Sparkles, 
  Calculator, 
  Utensils, 
  Wind, 
  Fan, 
  CalendarCheck, 
  HelpCircle, 
  Shield, 
  ArrowRight,
  Info
} from 'lucide-react';
import { ROOM_TARIFFS, PG_INFO } from '../data/pgData';
import { SharingType, RoomType } from '../types';
import { calculateRent, formatINR } from '../utils/helpers';

interface PricingCalculatorProps {
  onSelectPlanAndBook: (config: {
    sharing: SharingType;
    roomType: RoomType;
    foodIncluded: boolean;
  }) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onSelectPlanAndBook }) => {
  // Global view toggle for cards
  const [activeTabRoomType, setActiveTabRoomType] = useState<RoomType>('ac');

  // Interactive Dynamic Estimator state
  const [selectedSharing, setSelectedSharing] = useState<SharingType>(2);
  const [estimatorRoomType, setEstimatorRoomType] = useState<RoomType>('ac');
  const [includeFood, setIncludeFood] = useState<boolean>(true);

  // Computed rent for calculator
  const rentBreakdown = calculateRent(selectedSharing, estimatorRoomType, includeFood);

  return (
    <section id="pricing" className="py-12 sm:py-16 bg-white border-b border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-3">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Transparent Pricing & Zero Brokerage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 font-sans">
            Room Tariffs & Sharing Options
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Choose from fully furnished <strong className="text-slate-900 font-bold">1, 2, 3, and 4 sharing</strong> AC & Non-AC rooms with attached bathrooms, high-speed Wi-Fi, electricity & housekeeping included.
          </p>
        </div>

        {/* Highlight Food Add-on Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 border border-amber-200/90 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    Homely 3-Times Food Available at +₹2,500/month Extra
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
                    AC & Non-AC
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Includes freshly cooked Breakfast (7-10 AM), Lunch (1-2:30 PM) and Dinner (7:30-9:30 PM). Opt-in or opt-out anytime!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setIncludeFood(true);
                const el = document.getElementById('rent-estimator-tool');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              Calculate with Food
            </button>
          </div>
        </div>

        {/* AC vs Non-AC Filter Switch */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200">
            <button
              id="tariff-tab-ac"
              onClick={() => setActiveTabRoomType('ac')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabRoomType === 'ac'
                  ? 'bg-white text-amber-700 shadow-sm border border-stone-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wind className="w-4 h-4 text-amber-600" />
              <span>Air Conditioned (AC)</span>
            </button>
            <button
              id="tariff-tab-non-ac"
              onClick={() => setActiveTabRoomType('non-ac')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTabRoomType === 'non-ac'
                  ? 'bg-white text-amber-700 shadow-sm border border-stone-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Fan className="w-4 h-4 text-amber-600" />
              <span>Non-AC Rooms</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12">
          {ROOM_TARIFFS.map((tariff) => {
            const currentPrice = activeTabRoomType === 'ac' ? tariff.acPrice : tariff.nonAcPrice;
            const alternatePrice = activeTabRoomType === 'ac' ? tariff.nonAcPrice : tariff.acPrice;
            const alternateLabel = activeTabRoomType === 'ac' ? 'Non-AC' : 'AC';
            const isPopular = tariff.sharing === 2;

            return (
              <div
                key={tariff.sharing}
                className={`relative rounded-3xl bg-white border flex flex-col justify-between transition-all duration-200 hover:border-amber-300 hover:shadow-md ${
                  isPopular
                    ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 shadow-sm'
                }`}
              >
                {/* Top Badge */}
                {tariff.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-3.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase shadow-sm ${
                        isPopular
                          ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950'
                          : 'bg-stone-100 text-slate-700 border border-stone-200'
                      }`}
                    >
                      {tariff.badge}
                    </span>
                  </div>
                )}

                {/* Card Top / Header */}
                <div className="p-5 pt-6 pb-4 border-b border-stone-100">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-extrabold text-slate-900">{tariff.title}</h3>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {tariff.availability}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 min-h-[32px] line-clamp-2 font-medium">{tariff.subtitle}</p>

                  {/* Primary Price Display */}
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600 font-sans">
                        {formatINR(currentPrice)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ month</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-slate-500 font-medium">
                        {activeTabRoomType === 'ac' ? 'AC Tariff' : 'Non-AC Tariff'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {alternateLabel}: {formatINR(alternatePrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Features List */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included with Bed:
                    </div>
                    {tariff.features.slice(0, 5).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      id={`book-card-${tariff.sharing}-sharing`}
                      onClick={() =>
                        onSelectPlanAndBook({
                          sharing: tariff.sharing,
                          roomType: activeTabRoomType,
                          foodIncluded: false,
                        })
                      }
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-slate-700 font-bold text-xs border border-stone-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Reserve Room Only</span>
                    </button>

                    <button
                      id={`book-card-food-${tariff.sharing}-sharing`}
                      onClick={() =>
                        onSelectPlanAndBook({
                          sharing: tariff.sharing,
                          roomType: activeTabRoomType,
                          foodIncluded: true,
                        })
                      }
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Book with Food (+₹2,500)</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Dynamic Cost Estimator Tool (Interactive Sandbox) */}
        <div
          id="rent-estimator-tool"
          className="rounded-3xl bg-stone-50/80 border border-stone-200 p-6 sm:p-8 lg:p-8 shadow-sm relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls Column */}
            <div className="lg:col-span-7 space-y-5">
              
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-2">
                  <Calculator className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rent Calculator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Interactive Monthly Rent Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Adjust room sharing, cooling preference, and food options to estimate exact monthly tariff.
                </p>
              </div>

              {/* Step 1: Select Sharing */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Sharing Preference</span>
                  <span className="text-amber-700 normal-case font-bold text-xs">
                    {selectedSharing} Person{selectedSharing > 1 ? 's' : ''} per room
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {([1, 2, 3, 4] as SharingType[]).map((sharing) => {
                    const isSelected = selectedSharing === sharing;
                    return (
                      <button
                        key={sharing}
                        id={`estimator-sharing-${sharing}`}
                        onClick={() => setSelectedSharing(sharing)}
                        className={`p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm ring-1 ring-amber-500/30 font-bold'
                            : 'bg-white border-stone-200 text-slate-600 hover:text-slate-900 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-base sm:text-lg font-black font-sans">{sharing}</div>
                        <div className="text-[11px] font-bold leading-tight">
                          {sharing === 1 ? 'Single' : `${sharing} Share`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Room Variant (AC / Non-AC) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Room Variant
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="estimator-type-ac"
                    onClick={() => setEstimatorRoomType('ac')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                      estimatorRoomType === 'ac'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-white border-stone-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${estimatorRoomType === 'ac' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-stone-100 text-slate-600'}`}>
                      <Wind className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-extrabold">With AC</div>
                      <div className="text-[10px] text-slate-500 font-medium">Air Conditioner Included</div>
                    </div>
                  </button>

                  <button
                    id="estimator-type-non-ac"
                    onClick={() => setEstimatorRoomType('non-ac')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                      estimatorRoomType === 'non-ac'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-white border-stone-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${estimatorRoomType === 'non-ac' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-stone-100 text-slate-600'}`}>
                      <Fan className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-extrabold">Non-AC</div>
                      <div className="text-[10px] text-slate-500 font-medium">Ceiling Fan & Airflow</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 3: Food Add-on Toggle Checkbox */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Food Preference
                </label>
                <div
                  onClick={() => setIncludeFood(!includeFood)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    includeFood
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        includeFood ? 'bg-slate-950 text-amber-400 font-black' : 'border border-stone-300 bg-stone-50'
                      }`}
                    >
                      {includeFood && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <span className={`text-xs sm:text-sm font-extrabold flex items-center gap-2 ${includeFood ? 'text-slate-950' : 'text-slate-900'}`}>
                        Add 3 Times Fresh Homely Food (+₹2,500/mo)
                      </span>
                      <p className={`text-[11px] font-medium ${includeFood ? 'text-slate-900/90' : 'text-slate-500'}`}>
                        Fresh South Indian & North Indian breakfast, lunch, and dinner.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Summary Invoice & Book Action Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white border border-stone-200 p-6 shadow-sm">
                
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <h4 className="text-sm font-extrabold text-slate-900">Summary Estimate</h4>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                    Zero Brokerage
                  </span>
                </div>

                {/* Line Item Breakdown */}
                <div className="space-y-2.5 text-xs mb-5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      {selectedSharing} Sharing ({estimatorRoomType.toUpperCase()})
                    </span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {formatINR(rentBreakdown.baseRent)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      3-Times Homely Food
                    </span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {includeFood ? formatINR(rentBreakdown.foodCost) : '₹0 (Not opted)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-2 border-t border-stone-100">
                    <span>Wi-Fi, Water, 24hr Power & Laundry</span>
                    <span className="text-emerald-700 font-bold">Included</span>
                  </div>
                </div>

                {/* Total Rent Highlight */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 mb-5">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-slate-600 uppercase tracking-wider font-extrabold">
                      Total Payable
                    </span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600 font-sans">
                        {formatINR(rentBreakdown.totalMonthly)}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1 font-medium">/mo</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center justify-between pt-2 border-t border-amber-200/60 font-medium">
                    <span>Refundable Caution Deposit:</span>
                    <span className="text-slate-900 font-bold">₹{rentBreakdown.deposit}</span>
                  </div>
                </div>

                {/* Book Selected Room Button */}
                <button
                  id="estimator-book-selected-btn"
                  onClick={() =>
                    onSelectPlanAndBook({
                      sharing: selectedSharing,
                      roomType: estimatorRoomType,
                      foodIncluded: includeFood,
                    })
                  }
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CalendarCheck className="w-4 h-4 text-slate-950" />
                  <span>Book Now ({formatINR(rentBreakdown.totalMonthly)}/mo)</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <p className="text-[10px] text-center text-slate-500 mt-2.5 font-medium">
                  Instant reservation • Free visit scheduling • Pay after inspection
                </p>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
