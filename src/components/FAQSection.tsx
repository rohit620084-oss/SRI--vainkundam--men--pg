import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../data/pgData';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-stone-50/60 border-b border-stone-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 font-sans">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Everything you need to know about room tariffs, food plans, deposits, and visiting Sri Vaikundam Men's PG.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl bg-white border overflow-hidden transition-all shadow-2xs ${
                  isOpen ? 'border-amber-300 ring-2 ring-amber-500/10' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <button
                  id={`faq-toggle-${index}`}
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/70 transition-colors"
                >
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                    isOpen ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-slate-500'
                  }`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 bg-stone-50/50 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
