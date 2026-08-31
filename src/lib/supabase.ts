import { createClient } from '@supabase/supabase-js';
import { BookingSubmission } from '../types';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const SUPABASE_URL = 
  env.VITE_SUPABASE_URL || 'https://jstguwjmojmojmcbsmbn.supabase.co';

const SUPABASE_ANON_KEY = 
  env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_YqFEOa8JrKKaSnOKZqme5A_ptd9hY9d';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- Sri Vaikundam Men's PG - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =========================================================

-- 1. Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  room_type TEXT NOT NULL, -- 'ac' or 'non-ac'
  sharing INTEGER NOT NULL, -- 1, 2, 3, or 4
  food_included BOOLEAN NOT NULL DEFAULT TRUE,
  occupation TEXT,
  company_or_college TEXT,
  move_in_date TEXT,
  notes TEXT,
  total_monthly_rent NUMERIC NOT NULL,
  status TEXT DEFAULT 'Visit Scheduled'
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for Web Reservations
-- Allow anyone (public/anon) to submit a new booking
CREATE POLICY "Allow public insert to bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone (public/anon) to view bookings
CREATE POLICY "Allow public select from bookings"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow updates (e.g. status changes)
CREATE POLICY "Allow public update on bookings"
ON public.bookings
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
`;

export interface SupabaseBookingRow {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  room_type: string;
  sharing: number;
  food_included: boolean;
  occupation?: string | null;
  company_or_college?: string | null;
  move_in_date?: string | null;
  notes?: string | null;
  total_monthly_rent: number;
  status: string;
}

export async function saveBookingToSupabase(booking: BookingSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: booking.id,
      created_at: booking.createdAt,
      full_name: booking.fullName,
      phone: booking.phone,
      room_type: booking.roomType,
      sharing: booking.sharing,
      food_included: booking.foodIncluded,
      occupation: booking.occupation || null,
      company_or_college: booking.companyOrCollege || null,
      move_in_date: booking.moveInDate || null,
      notes: booking.notes || null,
      total_monthly_rent: booking.totalMonthlyRent,
      status: booking.status || 'Visit Scheduled',
    };

    const { error } = await supabase
      .from('bookings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error saving booking to Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

export async function fetchBookingsFromSupabase(): Promise<{ data: BookingSubmission[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    const mapped: BookingSubmission[] = (data || []).map((row: SupabaseBookingRow) => ({
      id: row.id,
      createdAt: row.created_at,
      fullName: row.full_name,
      phone: row.phone,
      roomType: (row.room_type === 'non-ac' ? 'non-ac' : 'ac') as any,
      sharing: row.sharing as any,
      foodIncluded: Boolean(row.food_included),
      occupation: (row.occupation as any) || 'IT Employee',
      companyOrCollege: row.company_or_college || undefined,
      moveInDate: row.move_in_date || '',
      notes: row.notes || undefined,
      totalMonthlyRent: Number(row.total_monthly_rent),
      status: (row.status as any) || 'Visit Scheduled',
    }));

    return { data: mapped };
  } catch (err: any) {
    console.error('Error fetching bookings from Supabase:', err);
    return { data: [], error: err?.message || 'Network error' };
  }
}

export async function updateBookingStatusInSupabase(
  id: string, 
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.warn('Supabase update status error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error updating booking status in Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

export async function deleteBookingFromSupabase(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting booking from Supabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
