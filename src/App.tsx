import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { PricingCalculator } from './components/PricingCalculator';
import { AmenitiesGrid } from './components/AmenitiesGrid';
import { FoodSchedule } from './components/FoodSchedule';
import { RulesNoticeBoard } from './components/RulesNoticeBoard';
import { LocationContact } from './components/LocationContact';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BookingHistoryDrawer } from './components/BookingHistoryDrawer';
import { FloatingActions } from './components/FloatingActions';
import { PageViewHeader } from './components/PageViewHeader';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SharingType, RoomType, BookingSubmission, TabType } from './types';
import { getSavedBookings, syncBookingsWithSupabase } from './utils/helpers';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sv_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [bookingPrefill, setBookingPrefill] = useState<{
    sharing?: SharingType;
    roomType?: RoomType;
    foodIncluded?: boolean;
  }>({
    sharing: 2,
    roomType: 'ac',
    foodIncluded: true,
  });

  const [savedBookings, setSavedBookings] = useState<BookingSubmission[]>([]);

  const refreshBookings = () => {
    setSavedBookings(getSavedBookings());
  };

  useEffect(() => {
    refreshBookings();

    // Sync with Supabase on mount
    syncBookingsWithSupabase().then((data) => {
      setSavedBookings(data);
    });

    // Read initial hash if present
    const hash = window.location.hash.replace('#', '');
    const validTabs: Record<string, TabType> = {
      home: 'home',
      rooms: 'rooms',
      pricing: 'rooms',
      amenities: 'amenities',
      food: 'food',
      rules: 'rules',
      location: 'location',
    };
    if (hash && validTabs[hash]) {
      setActiveTab(validTabs[hash]);
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash && validTabs[currentHash]) {
        setActiveTab(validTabs[currentHash]);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (prefill?: {
    sharing?: SharingType;
    roomType?: RoomType;
    foodIncluded?: boolean;
  }) => {
    setBookingPrefill(prefill || undefined);
    setIsBookingModalOpen(true);
  };

  const handleClearBookings = () => {
    localStorage.removeItem('sri_vaikundam_bookings');
    setSavedBookings([]);
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthenticated(true);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('sv_admin_auth');
    } catch {
      // ignore
    }
    setIsAdminAuthenticated(false);
    setIsAdminDashboardOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Persistent Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenBooking={() => handleOpenBooking()}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        savedBookingsCount={savedBookings.length}
      />

      {/* Main Tab View Routing System (Renders ONLY the active tab view) */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleTabChange}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {activeTab === 'rooms' && (
          <div className="animate-in fade-in duration-200">
            <PageViewHeader
              currentTab="rooms"
              title="Room Tariffs & Rent Estimator"
              badge="Sharing Options & Monthly Rates"
              description="Choose from 1, 2, 3, and 4 sharing AC & Non-AC rooms. Use our live interactive rent calculator below to customize your stay with or without homely food."
              onNavigate={handleTabChange}
            />
            <PricingCalculator
              onSelectPlanAndBook={(config) => handleOpenBooking(config)}
            />
          </div>
        )}

        {activeTab === 'amenities' && (
          <div className="animate-in fade-in duration-200">
            <PageViewHeader
              currentTab="amenities"
              title="Amenities & Facilities"
              badge="Comfort, Security & Essentials"
              description="Sri Vaikundam Men's PG provides high-speed Wi-Fi, 24/7 power backup, RO purified drinking water, CCTV security, and automatic washing machine facilities."
              onNavigate={handleTabChange}
            />
            <AmenitiesGrid />
          </div>
        )}

        {activeTab === 'food' && (
          <div className="animate-in fade-in duration-200">
            <PageViewHeader
              currentTab="food"
              title="Food Timings & Dining Schedule"
              badge="3-Times Homely Meals"
              description="Enjoy fresh, hygienic, and nutritious South and North Indian home-cooked meals every day. Review our meal schedule and daily menu items below."
              onNavigate={handleTabChange}
            />
            <FoodSchedule />
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="animate-in fade-in duration-200">
            <PageViewHeader
              currentTab="rules"
              title="Hostel Rules & Notice Board"
              badge="Resident Guidelines & Policies"
              description="Clear, transparent policies regarding gate curfew, guest policies, payment schedules, security deposits, and peaceful hostel community guidelines."
              onNavigate={handleTabChange}
            />
            <RulesNoticeBoard />
          </div>
        )}

        {activeTab === 'location' && (
          <div className="animate-in fade-in duration-200">
            <PageViewHeader
              currentTab="location"
              title="Location, Map & Contact Desk"
              badge="Sholinganallur, Chennai (OMR)"
              description="Located conveniently near major IT hubs including ELCOT SEZ, TCS, Infosys, and Wipro with seamless access to bus stops and dining options."
              onNavigate={handleTabChange}
            />
            <LocationContact />
          </div>
        )}
      </main>

      {/* Persistent Footer */}
      <Footer
        onSelectTab={handleTabChange}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating Actions: Always accessible across all pages */}
      <FloatingActions 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Schedule Visit / Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialConfig={bookingPrefill}
        onBookingSuccess={refreshBookings}
      />

      {/* User's Stored Bookings Drawer */}
      <BookingHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        bookings={savedBookings}
        onClearBookings={handleClearBookings}
        onRefreshBookings={refreshBookings}
      />

      {/* Owner / Admin PIN Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />

      {/* Owner / Admin Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
        onBookingsUpdated={refreshBookings}
      />
    </div>
  );
}

