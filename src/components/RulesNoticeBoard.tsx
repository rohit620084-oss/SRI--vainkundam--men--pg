import React from 'react';
import { 
  FileText, 
  Users, 
  BellRing, 
  ZapOff, 
  Ban, 
  CigaretteOff, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { HOSTEL_RULES } from '../data/pgData';

const ruleIconMap: Record<string, React.ElementType> = {
  Users,
  BellRing,
  ZapOff,
  Ban,
  CigaretteOff,
  Lock,
};

export const RulesNoticeBoard: React.FC = () => {
  return (
    <section id="rules" className="py-12 sm:py-16 bg-stone-50/60 border-b border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-3">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Community Guidelines & Safety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 font-sans">
            Hostel Rules & Regulations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            To ensure a safe, peaceful, and respectful environment for all working professionals and students, all residents are requested to adhere to our hostel norms.
          </p>
        </div>

        {/* Notice Board Container */}
        <div className="rounded-3xl bg-white border border-stone-200 p-5 sm:p-7 lg:p-8 shadow-sm relative overflow-hidden">
          
          {/* Header Tag Inside Board */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-stone-100 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Official PG Notice Board</h3>
                <p className="text-xs text-slate-500 font-medium">Sri Vaikundam Men's PG, Sholinganallur Management</p>
              </div>
            </div>

            <div className="px-3.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-xs text-slate-600 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Enforced for Resident Safety</span>
            </div>
          </div>

          {/* 6 Rules Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOSTEL_RULES.map((rule) => {
              const Icon = ruleIconMap[rule.iconName] || FileText;

              const isProhibited = rule.badgeType === 'prohibited';
              const isWarning = rule.badgeType === 'warning';

              let borderColor = 'border-stone-200 hover:border-amber-300';
              let iconBg = 'bg-amber-50 text-amber-600 border-amber-200/80';
              let badgeColor = 'bg-stone-100 text-slate-700 border-stone-200';

              if (isProhibited) {
                borderColor = 'border-rose-200 hover:border-rose-300 bg-rose-50/20';
                iconBg = 'bg-rose-50 text-rose-600 border-rose-200';
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
              } else if (isWarning) {
                borderColor = 'border-amber-200 hover:border-amber-300 bg-amber-50/20';
                iconBg = 'bg-amber-50 text-amber-700 border-amber-200';
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
              } else {
                borderColor = 'border-stone-200 hover:border-amber-200 bg-stone-50/30';
                iconBg = 'bg-amber-50 text-amber-700 border-amber-200/80';
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
              }

              return (
                <div
                  key={rule.id}
                  id={`rule-card-${rule.id}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${borderColor} bg-white shadow-2xs`}
                >
                  <div>
                    {/* Icon & Category Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] border ${badgeColor}`}>
                        {rule.category}
                      </span>
                    </div>

                    {/* Rule Title */}
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 leading-snug">
                      {rule.title}
                    </h4>

                    {/* Rule Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {rule.description}
                    </p>
                  </div>

                  {/* Highlight Callout */}
                  {rule.highlight && (
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-bold">
                      {isProhibited ? (
                        <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <span className={isProhibited ? 'text-rose-700' : isWarning ? 'text-amber-800' : 'text-amber-800'}>
                        {rule.highlight}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Summary Note */}
          <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">We prioritize resident peace, security, and cleanliness at all times.</span>
            </div>
            <span className="text-slate-900 font-extrabold">Sri Vaikundam Management</span>
          </div>

        </div>

      </div>
    </section>
  );
};
