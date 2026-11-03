import emailjs from '@emailjs/browser';
import { BookingSubmission } from '../types';
import { formatINR } from '../utils/helpers';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const EMAILJS_SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID || 'service_o63qngn';
export const EMAILJS_TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID_HERE';
export const EMAILJS_PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY_HERE';

// 1. Initialize EmailJS with the Public Key
try {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
} catch (err) {
  console.warn('[EmailJS] Initialization warning:', err);
}

export interface BookingEmailTemplateParams {
  booking_id: string;
  name: string;
  phone: string;
  occupation: string;
  room_preference: string;
  food_included: string;
  rent: string;
  visit_date: string;
  [key: string]: unknown;
}

/**
 * Triggers non-blocking background automated email notification via EmailJS
 */
export async function sendBookingEmailNotification(
  booking: BookingSubmission
): Promise<{ success: boolean; error?: string; status?: number }> {
  const serviceId = EMAILJS_SERVICE_ID;
  const templateId = EMAILJS_TEMPLATE_ID;
  const publicKey = EMAILJS_PUBLIC_KEY;

  const templateParams: BookingEmailTemplateParams = {
    booking_id: booking.id,
    name: booking.fullName,
    phone: booking.phone,
    occupation: booking.occupation + (booking.companyOrCollege ? ` (${booking.companyOrCollege})` : ''),
    room_preference: `${booking.sharing} Sharing ${booking.roomType.toUpperCase()}`,
    food_included: booking.foodIncluded ? 'Yes (3 Times Homely South Indian Food Included)' : 'No (Room Only)',
    rent: `${formatINR(booking.totalMonthlyRent)} / month`,
    visit_date: booking.moveInDate,
    // Extra convenience properties
    notes: booking.notes || 'None',
  };

  try {
    console.log('[EmailJS] Dispatched email notification for booking:', booking.id, {
      serviceId,
      templateId,
    });

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('[EmailJS] Email notification sent successfully:', response.status, response.text);
    return { success: true, status: response.status };
  } catch (error: any) {
    const errorMsg = error?.text || error?.message || String(error);
    console.warn('[EmailJS] Automated email notification error (non-blocking):', errorMsg);
    return { success: false, error: errorMsg };
  }
}

export default emailjs;
