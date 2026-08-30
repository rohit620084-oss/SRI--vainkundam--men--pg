export type SharingType = 1 | 2 | 3 | 4;
export type RoomType = 'ac' | 'non-ac';
export type TabType = 'home' | 'rooms' | 'amenities' | 'food' | 'rules' | 'location';

export interface RoomTariff {
  sharing: SharingType;
  title: string;
  subtitle: string;
  badge?: string;
  acPrice: number;
  nonAcPrice: number;
  features: string[];
  recommendedFor: string;
  availability: 'Available' | 'Few Beds Left' | 'High Demand';
}

export interface Amenity {
  id: string;
  iconName: string;
  title: string;
  description: string;
  badge: string;
  highlight?: boolean;
}

export interface FoodMeal {
  id: string;
  name: string;
  timeWindow: string;
  startHour: number; // 24hr format
  startMin: number;
  endHour: number;
  endMin: number;
  iconName: string;
  description: string;
  sampleMenu: string[];
  tag: string;
}

export interface HostelRule {
  id: string;
  iconName: string;
  category: 'Guest' | 'Safety' | 'Policy' | 'Disclaimer';
  title: string;
  description: string;
  highlight?: string;
  badgeType: 'warning' | 'info' | 'prohibited' | 'important';
}

export interface ContactPerson {
  number: string;
  displayNumber: string;
  label: string;
  isPrimary?: boolean;
  role: string;
}

export interface NearbyPlace {
  name: string;
  category: 'IT Park' | 'Transport' | 'Shopping' | 'Hospital';
  distance: string;
  travelTime: string;
}

export interface BookingSubmission {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  roomType: RoomType;
  sharing: SharingType;
  foodIncluded: boolean;
  occupation: 'IT Employee' | 'Student' | 'Business / Other';
  companyOrCollege?: string;
  moveInDate: string;
  notes?: string;
  totalMonthlyRent: number;
  status: 'Confirmed' | 'Pending Review' | 'Visit Scheduled';
}
