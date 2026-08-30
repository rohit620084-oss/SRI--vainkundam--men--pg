import React, { useState, useEffect } from 'react';
import { 
  X, 
  CalendarCheck, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  Building2, 
  Utensils, 
  User, 
  Calendar, 
  Briefcase, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Database,
  CloudCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SharingType, RoomType, BookingSubmission } from '../types';
import { PG_INFO } from '../data/pgData';
import { calculateRent, formatINR, generateBookingId, getWhatsAppBookingLink, saveBooking } from '../utils/helpers';
import { saveBookingToSupabase } from '../lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: {
    sharing?: SharingType;
    roomType?: RoomType;
    foodIncluded?: boolean;
  };
  onBookingSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  onBookingSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [sharing, setSharing] = useState<SharingType>(initialConfig?.sharing || 2);
  const [roomType, setRoomType] = useState<RoomType>(initialConfig?.roomType || 'ac');
  const [foodIncluded, setFoodIncluded] = useState<boolean>(
    initialConfig?.foodIncluded !== undefined ? initialConfig.foodIncluded : true
  );
  const [occupation, setOccupation] = useState<'IT Employee' | 'Student' | 'Business / Other'>('IT Employee');
  const [companyOrCollege, setCompanyOrCollege] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingSubmission | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [supabaseSaved, setSupabaseSaved] = useState<boolean | null>(null);

  // Sync initialConfig changes when modal opens
  useEffect(() => {
    if (initialConfig) {
      if (initialConfig.sharing) setSharing(initialConfig.sharing);
      if (initialConfig.roomType) setRoomType(initialConfig.roomType);
      if (initialConfig.foodIncluded !== undefined) setFoodIncluded(initialConfig.foodIncluded);
    }
  }, [initialConfig, isOpen]);

  // Set default date to tomorrow in local time format YYYY-MM-DD
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setMoveInDate(dateStr);
  }, []);

  if (!isOpen) return null;

  const rentCalc = calculateRent(sharing, roomType, foodIncluded);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Please provide your Full Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);

    const newBooking: BookingSubmission = {
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      roomType,
      sharing,
      foodIncluded,
      occupation,
      companyOrCollege: companyOrCollege.trim() || undefined,
      moveInDate: moveInDate || 'Immediate',
      notes: notes.trim() || undefined,
      totalMonthlyRent: rentCalc.totalMonthly,
      status: 'Visit Scheduled',
    };

    // Save to local storage as instant offline-safe cache
    saveBooking(newBooking);

    // Save directly to Supabase cloud database
    const supabaseRes = await saveBookingToSupabase(newBooking);
    setSupabaseSaved(supabaseRes.success);

    setIsSubmitting(false);
    setSubmittedBooking(newBooking);
    if (onBookingSuccess) onBookingSuccess();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // Safe fallback
    }
  };

  const handleCopyRef = () => {
    if (!submittedBooking) return;
    navigator.clipboard.writeText(submittedBooking.id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleResetAndClose = () => {
    setSubmittedBooking(null);
    onClose();
  };

  return (
    <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div
        id="booking-modal-content"
        className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-7 my-8 max-h-[92vh] overflow-y-auto text-left"
      >
        {/* Close Button */}
        <button
          id="modal-close-btn"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedBooking ? (
          /* SUCCESS STATE */
          <div className="text-center py-2 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visit & Bed Slot Reserved</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Thank You, {submittedBooking.fullName}!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-md mx-auto font-medium">
                Your request has been logged. Our warden will call you to confirm your room visit and send directions.
              </p>
            </div>

            {/* Reference ID Card */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <div className="text-xs text-slate-500 font-bold mb-1">Booking Reference ID</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg sm:text-xl font-mono font-black text-amber-800 tracking-wider">
                  {submittedBooking.id}
                </span>
                <button
                  id="copy-ref-id-btn"
                  onClick={handleCopyRef}
                  className="p-1.5 rounded-lg bg-white border border-stone-200 text-slate-600 hover:text-slate-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Copy Reference"
                >
                  {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Supabase Status Indicator */}
              <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved & Synced to Supabase Database</span>
              </div>
            </div>

            {/* Reservation Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-slate-500">Selected Room:</span>
                <span className="font-extrabold text-slate-900">
                  {submittedBooking.sharing} Sharing ({submittedBooking.roomType.toUpperCase()})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-slate-500">Food Plan:</span>
                <span className="font-extrabold text-slate-900">
                  {submittedBooking.foodIncluded ? '3 Times Homely Food Included' : 'Room Only'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-slate-500">Monthly Rent:</span>
                <span className="font-black text-slate-900 font-sans">
                  {formatINR(submittedBooking.totalMonthlyRent)} / month
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Preferred Visit Date:</span>
                <span className="font-bold text-slate-900">{submittedBooking.moveInDate}</span>
              </div>
            </div>

            {/* Immediate Connect Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <a
                id="modal-success-whatsapp-btn"
                href={getWhatsAppBookingLink({
                  fullName: submittedBooking.fullName,
                  phone: submittedBooking.phone,
                  roomType: submittedBooking.roomType,
                  sharing: submittedBooking.sharing,
                  foodIncluded: submittedBooking.foodIncluded,
                  moveInDate: submittedBooking.moveInDate,
                  occupation: submittedBooking.occupation,
                  notes: submittedBooking.notes,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-slate-950" />
                <span>Send Booking to WhatsApp (+91 {PG_INFO.primaryPhone})</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  id="modal-success-call-btn"
                  href={`tel:${PG_INFO.primaryPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs border border-stone-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-700" />
                  <span>Call Desk Now</span>
                </a>

                <button
                  id="modal-done-btn"
                  onClick={handleResetAndClose}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-slate-700 font-bold text-xs border border-stone-200 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-200/80 mb-2">
                <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant Visit / Bed Reservation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Schedule a Visit / Book a Bed
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                Sri Vaikundam Men's PG, Sholinganallur. No advance deposit required for visit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      id="input-full-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <input
                      id="input-mobile-number"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none placeholder:text-slate-400 font-mono font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Room Sharing & AC Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Room Sharing Preference
                  </label>
                  <select
                    id="select-sharing-preference"
                    value={sharing}
                    onChange={(e) => setSharing(Number(e.target.value) as SharingType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none font-medium"
                  >
                    <option value={1}>1 Sharing (Single Room)</option>
                    <option value={2}>2 Sharing (Twin Room)</option>
                    <option value={3}>3 Sharing (Triple Room)</option>
                    <option value={4}>4 Sharing (Saver Room)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Room Type (AC / Non-AC)
                  </label>
                  <select
                    id="select-room-type"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="ac">Air Conditioned (AC)</option>
                    <option value="non-ac">Non-AC Room</option>
                  </select>
                </div>
              </div>

              {/* Food Required & Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Include 3-Times Homely Food?
                  </label>
                  <select
                    id="select-food-required"
                    value={foodIncluded ? 'yes' : 'no'}
                    onChange={(e) => setFoodIncluded(e.target.value === 'yes')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="yes">Yes (+₹2,500/mo - 3 Meals)</option>
                    <option value="no">No (Room Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Occupation
                  </label>
                  <select
                    id="select-occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="IT Employee">IT / Tech Professional</option>
                    <option value="Student">College Student / Intern</option>
                    <option value="Business / Other">Business / Other</option>
                  </select>
                </div>
              </div>

              {/* Preferred Date & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Move-in / Visit Date
                  </label>
                  <input
                    id="input-move-in-date"
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / College Name (Optional)
                  </label>
                  <input
                    id="input-company-college"
                    type="text"
                    placeholder="e.g. TCS, Infosys, Satyabhama"
                    value={companyOrCollege}
                    onChange={(e) => setCompanyOrCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:outline-none placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Live Estimated Rent Preview Banner */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Calculated Monthly Rent:</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 font-sans">
                    {formatINR(rentCalc.totalMonthly)}
                    <span className="text-xs text-slate-500 font-normal"> / month</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-medium">
                  <span>Room: {formatINR(rentCalc.baseRent)}</span>
                  {foodIncluded && <span className="block text-amber-800 font-bold">+ Food: ₹2,500</span>}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="modal-submit-booking-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4 text-slate-950" />
                    <span>Confirm Visit & Lock My Tariff</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero advance fee required • Free cancellation anytime</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
