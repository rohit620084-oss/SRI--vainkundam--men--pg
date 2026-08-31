import { SharingType, RoomType, BookingSubmission } from '../types';
import { PG_INFO, ROOM_TARIFFS, FOOD_SCHEDULE } from '../data/pgData';
import { 
  saveBookingToSupabase, 
  fetchBookingsFromSupabase, 
  updateBookingStatusInSupabase, 
  deleteBookingFromSupabase 
} from '../lib/supabase';

export function calculateRent(sharing: SharingType, roomType: RoomType, includeFood: boolean) {
  const tariff = ROOM_TARIFFS.find((t) => t.sharing === sharing) || ROOM_TARIFFS[1];
  const baseRent = roomType === 'ac' ? tariff.acPrice : tariff.nonAcPrice;
  const foodCost = includeFood ? PG_INFO.foodAddonPrice : 0;
  const totalMonthly = baseRent + foodCost;

  return {
    baseRent,
    foodCost,
    totalMonthly,
    deposit: PG_INFO.securityDeposit,
    tariff,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `SVP-${randomDigits}`;
}

export function getWhatsAppBookingLink(booking: {
  fullName: string;
  phone: string;
  roomType: RoomType;
  sharing: SharingType;
  foodIncluded: boolean;
  moveInDate?: string;
  occupation?: string;
  notes?: string;
}): string {
  const calc = calculateRent(booking.sharing, booking.roomType, booking.foodIncluded);
  const sharingText = `${booking.sharing} Sharing (${booking.roomType.toUpperCase()})`;
  const foodText = booking.foodIncluded ? 'Yes (3 Times Homely Food @ ₹2,500)' : 'No (Room Only)';

  const text = `Hello Sri Vaikundam Men's PG Management,

I am interested in scheduling a visit / reserving a bed at your PG in Sholinganallur.

📋 *My Details:*
• Name: ${booking.fullName || 'Guest'}
• Mobile: ${booking.phone || 'Not provided'}
• Occupation: ${booking.occupation || 'Working Professional'}
• Room Preference: ${sharingText}
• Food Included: ${foodText}
• Estimated Rent: ${formatINR(calc.totalMonthly)} / month
• Planned Visit / Move-in Date: ${booking.moveInDate || 'Immediate / This Week'}
${booking.notes ? `• Note: ${booking.notes}` : ''}

Please confirm the room availability and share the exact location. Thank you!`;

  return `https://wa.me/91${PG_INFO.primaryPhone}?text=${encodeURIComponent(text)}`;
}

export function getQuickWhatsAppLink(customMessage?: string): string {
  const defaultText = `Hello Sri Vaikundam Men's PG Sholinganallur, I would like to enquire about room availability and tariffs.`;
  const text = customMessage || defaultText;
  return `https://wa.me/91${PG_INFO.primaryPhone}?text=${encodeURIComponent(text)}`;
}

export function getMealStatus() {
  const now = new Date();
  // Compute Chennai time (IST is UTC +5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 3600000 * 5.5);
  const currentHour = ist.getHours();
  const currentMin = ist.getMinutes();
  const currentTimeVal = currentHour * 60 + currentMin;

  for (const meal of FOOD_SCHEDULE) {
    const mealStart = meal.startHour * 60 + meal.startMin;
    const mealEnd = meal.endHour * 60 + meal.endMin;

    if (currentTimeVal >= mealStart && currentTimeVal <= mealEnd) {
      return {
        activeMealId: meal.id,
        statusText: `Now Serving: ${meal.name}`,
        isOpen: true,
        meal,
      };
    }
  }

  // Find next upcoming meal
  for (const meal of FOOD_SCHEDULE) {
    const mealStart = meal.startHour * 60 + meal.startMin;
    if (currentTimeVal < mealStart) {
      return {
        activeMealId: null,
        statusText: `Next: ${meal.name} at ${meal.timeWindow.split('–')[0].trim()}`,
        isOpen: false,
        meal,
      };
    }
  }

  // If past dinner, next is breakfast tomorrow
  return {
    activeMealId: null,
    statusText: `Next: Morning Breakfast at 07:00 AM`,
    isOpen: false,
    meal: FOOD_SCHEDULE[0],
  };
}

const STORAGE_KEY = 'sri_vaikundam_bookings';

export function saveBooking(booking: BookingSubmission) {
  try {
    const existing = getSavedBookings();
    const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save booking to localStorage', err);
  }

  // Asynchronously push to Supabase Cloud
  saveBookingToSupabase(booking).catch((err) => {
    console.warn('Background Supabase sync notice:', err);
  });
}

export function getSavedBookings(): BookingSubmission[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to retrieve bookings', err);
    return [];
  }
}

export async function syncBookingsWithSupabase(): Promise<BookingSubmission[]> {
  const local = getSavedBookings();
  try {
    const { data: remote, error } = await fetchBookingsFromSupabase();
    if (error || !remote) {
      return local;
    }

    // Merge remote and local (remote takes precedence by id)
    const combinedMap = new Map<string, BookingSubmission>();
    
    // Add local first
    local.forEach((item) => combinedMap.set(item.id, item));
    // Overwrite / add from remote
    remote.forEach((item) => combinedMap.set(item.id, item));

    const merged = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error('Error syncing bookings with Supabase:', err);
    return local;
  }
}

export async function updateBookingStatus(
  id: string, 
  newStatus: BookingSubmission['status']
): Promise<BookingSubmission[]> {
  const current = getSavedBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Sync to Supabase in background
  updateBookingStatusInSupabase(id, newStatus).catch((err) => {
    console.warn('Supabase status sync error:', err);
  });

  return updated;
}

export async function deleteBookingItem(id: string): Promise<BookingSubmission[]> {
  const current = getSavedBookings();
  const updated = current.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Sync to Supabase in background
  deleteBookingFromSupabase(id).catch((err) => {
    console.warn('Supabase delete sync error:', err);
  });

  return updated;
}

export function getOwnerFollowUpWhatsAppLink(booking: BookingSubmission): string {
  const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const sharingText = `${booking.sharing} Sharing (${booking.roomType.toUpperCase()})`;

  const text = `Hello ${booking.fullName},

Greetings from *Sri Vaikundam Men's PG*, Sholinganallur! 🌟

We received your inquiry (Ref: *${booking.id}*) for *${sharingText}* with *${booking.foodIncluded ? '3-Times Homely Food' : 'Room Only'}*.

Your planned visit/move-in date: *${booking.moveInDate || 'Upcoming'}*.

Please let us know what time suits you best for a room walkthrough today. 

📍 *Location:* Behind Arvind Theatre, Karapakkam / Sholinganallur, Chennai.
📞 *Contact:* +91 ${PG_INFO.primaryPhone}

Looking forward to welcoming you!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}
