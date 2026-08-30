import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  Navigation, 
  Building, 
  Car, 
  ExternalLink,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { PG_INFO, CONTACT_NUMBERS, NEARBY_LANDMARKS } from '../data/pgData';
import { getQuickWhatsAppLink } from '../utils/helpers';

export const LocationContact: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(PG_INFO.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Sri Vaikundam Mens PG Sholinganallur Chennai'
  )}`;

  return (
    <section id="location" className="py-12 sm:py-16 bg-white border-b border-stone-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Prime Sholinganallur Location</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 font-sans">
            Location & Contact Desk
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Conveniently situated in Sholinganallur, Chennai with effortless walking and commuting distance to major IT parks, bus stands, restaurants, and convenience stores.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-10">
          
          {/* Left Column: Direct Phone Contacts & Management Desk */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-stone-50/70 border border-stone-200 p-5 sm:p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Call or WhatsApp Directly</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5 font-medium">
                Available 24x7 for spot admissions, room tours, and guest accommodation bookings.
              </p>

              {/* 3 Contact Numbers List */}
              <div className="space-y-2.5">
                {CONTACT_NUMBERS.map((contact, idx) => (
                  <div
                    key={contact.number}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      contact.isPrimary
                        ? 'bg-white border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{contact.label}</span>
                        {contact.isPrimary && (
                          <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                        {contact.displayNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">{contact.role}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        id={`contact-call-btn-${idx}`}
                        href={`tel:${contact.number}`}
                        className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors"
                        title={`Call ${contact.number}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        id={`contact-wa-btn-${idx}`}
                        href={`https://wa.me/91${contact.number}?text=${encodeURIComponent(
                          'Hello Sri Vaikundam Mens PG, I would like to inquire about room availability.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors"
                        title={`WhatsApp ${contact.number}`}
                      >
                        <MessageSquare className="w-4 h-4 text-amber-700" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Instant WhatsApp CTA */}
              <div className="mt-4 pt-3.5 border-t border-stone-200">
                <a
                  id="location-primary-whatsapp-btn"
                  href={getQuickWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950" />
                  <span>Start WhatsApp Chat (+91 7561964726)</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Address, Map Trigger & Nearby Distance Matrix */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Address Banner */}
            <div className="rounded-3xl bg-stone-50/70 border border-stone-200 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Hostel Address</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md font-medium leading-relaxed">
                    {PG_INFO.address}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="copy-address-btn"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  <a
                    id="open-google-maps-btn"
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>

              {/* Proximity / Distance Matrix */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>Nearby Tech Parks & Key Landmarks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {NEARBY_LANDMARKS.map((landmark) => (
                    <div
                      key={landmark.name}
                      className="p-2.5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800 truncate font-semibold">{landmark.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono font-black text-[11px] border border-amber-200/80">
                          {landmark.distance}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">({landmark.travelTime})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Room Reminder */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white border border-stone-200 text-xs text-slate-600 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Daily guest stays starting from <strong className="text-slate-900 font-bold">₹400/day</strong>. Inform management in advance.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
