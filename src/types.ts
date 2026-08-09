export type Role = 'user' | 'lawyer';
export type Language = 'bn' | 'en';

export type UserTab = 'home' | 'search' | 'chat' | 'profile';
export type LawyerTab = 'home' | 'chat' | 'appointments' | 'profile';

export type PracticeArea = 
  | 'Criminal Law' 
  | 'Civil Law' 
  | 'Family & Divorce' 
  | 'Land & Property' 
  | 'Corporate & Commercial' 
  | 'Cyber & Digital Security' 
  | 'Tax, VAT & Customs' 
  | 'Writ & Constitutional' 
  | 'Banking & Finance'
  | 'Labor & Employment';

export interface Review {
  id: string;
  lawyerId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  consultationType?: string;
  verifiedClient: boolean;
}

export interface Lawyer {
  id: string;
  name: string;
  nameBn: string;
  title: string; // e.g., Senior Advocate, Supreme Court of India / High Court
  titleBn: string;
  barAssociation: string; // e.g., Supreme Court Bar Association / Bar Council of Delhi
  avatar: string;
  rating: number;
  totalReviews: number;
  experienceYears: number;
  casesHandled: number;
  practiceAreas: PracticeArea[];
  courts: string[]; // e.g., Supreme Court of India, High Court
  courtsBn: string[];
  location: string; // e.g., Connaught Place, New Delhi / Park Street, Kolkata
  locationBn: string;
  bio: string;
  bioBn: string;
  education: string[];
  educationBn: string[];
  languages: string[];
  fees: {
    inPerson: number; // INR (₹)
    videoCall: number; // INR (₹)
    chat: number; // INR (₹)
  };
  availability: {
    days: string[];
    timeSlots: string[];
    isOnlineNow: boolean;
    acceptingClients: boolean;
  };
  phone: string;
  email: string;
}

export type ConsultationMode = 'in_person' | 'video_call' | 'chat';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerTitle: string;
  lawyerAvatar: string;
  lawyerLocation: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  date: string;
  timeSlot: string;
  consultationMode: ConsultationMode;
  caseType: string;
  caseDescription: string;
  status: AppointmentStatus;
  fee: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: 'user' | 'lawyer';
  text: string;
  timestamp: string;
  attachment?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  appointmentId?: string;
  lawyerName?: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  address: string;
  city: string;
  bio: string;
  memberSince: string;
  occupation?: string;
  emergencyContact?: string;
}

export interface Conversation {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerTitle: string;
  lawyerAvatar: string;
  lawyerOnline: boolean;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountUser: number;
  unreadCountLawyer: number;
}
