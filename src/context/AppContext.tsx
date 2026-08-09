import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Language,
  UserTab,
  LawyerTab,
  Lawyer,
  Review,
  Appointment,
  Conversation,
  ChatMessage,
  ConsultationMode,
  AppointmentStatus,
  UserProfileData,
  AppNotification,
} from '../types';
import {
  INITIAL_LAWYERS,
  INITIAL_REVIEWS,
  INITIAL_APPOINTMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/lawyersData';

const INITIAL_USER_PROFILE: UserProfileData = {
  id: 'user-001',
  name: 'Karan Sharma',
  phone: '+91 98300-11223',
  email: 'karan@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  address: 'Park Street, Kolkata',
  city: 'Kolkata',
  bio: 'Seeking legal guidance for civil, property, and corporate consultation.',
  memberSince: '2026',
  occupation: 'Business Owner',
  emergencyContact: '+91 98300-99887',
};

interface AppContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  userTab: UserTab;
  setUserTab: (tab: UserTab) => void;
  lawyerTab: LawyerTab;
  setLawyerTab: (tab: LawyerTab) => void;

  userProfile: UserProfileData;
  updateUserProfile: (updated: Partial<UserProfileData>) => void;

  lawyers: Lawyer[];
  reviews: Review[];
  appointments: Appointment[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  notifications: AppNotification[];
  clearAllNotifications: () => void;
  markNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;

  // Selected lawyer for profile detail modal view
  selectedLawyer: Lawyer | null;
  setSelectedLawyer: (lawyer: Lawyer | null) => void;

  // Booking Modal
  bookingLawyer: Lawyer | null;
  setBookingLawyer: (lawyer: Lawyer | null) => void;

  // Review Modal
  reviewLawyer: Lawyer | null;
  setReviewLawyer: (lawyer: Lawyer | null) => void;

  // Current logged in lawyer ID (for lawyer interface)
  currentLawyerId: string;
  setCurrentLawyerId: (id: string) => void;

  // Active chat conversation ID
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Methods
  addAppointment: (data: {
    lawyer: Lawyer;
    date: string;
    timeSlot: string;
    consultationMode: ConsultationMode;
    caseType: string;
    caseDescription: string;
    userName: string;
    userPhone: string;
    userEmail: string;
  }) => Appointment;

  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  addReview: (data: {
    lawyerId: string;
    userName: string;
    rating: number;
    comment: string;
    consultationType?: string;
  }) => void;

  sendMessage: (conversationId: string, text: string, senderRole: 'user' | 'lawyer') => void;
  markConversationAsRead: (conversationId: string, forRole: 'user' | 'lawyer') => void;

  startConversationWithLawyer: (lawyer: Lawyer) => string;

  updateLawyerProfile: (updated: Partial<Lawyer>) => void;

  toggleBookmark: (lawyerId: string) => void;
  bookmarkedLawyerIds: string[];

  // Helper translations
  t: (bn: string, en: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Role State - default null to show role selector gate on first visit
  const [role, setRoleState] = useState<Role | null>(() => {
    const saved = localStorage.getItem('low_axis_role');
    return saved === 'user' || saved === 'lawyer' ? (saved as Role) : null;
  });

  const setRole = (newRole: Role | null) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem('low_axis_role', newRole);
    } else {
      localStorage.removeItem('low_axis_role');
    }
  };

  // 2. Language State - default 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('low_axis_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('low_axis_lang', lang);
  };

  // Helper for inline text translation
  const t = (bn: string, en: string) => (language === 'bn' ? en : en);

  // 3. Navigation Tabs
  const [userTab, setUserTab] = useState<UserTab>('home');
  const [lawyerTab, setLawyerTab] = useState<LawyerTab>('home');

  // 4. Current Lawyer Profile ID (When in Lawyer Mode)
  const [currentLawyerId, setCurrentLawyerId] = useState<string>('lawyer-1');

  // 5. Data Collections
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('low_axis_v3_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [lawyers, setLawyers] = useState<Lawyer[]>(() => {
    const saved = localStorage.getItem('low_axis_v3_lawyers');
    return saved ? JSON.parse(saved) : INITIAL_LAWYERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('low_axis_v3_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('low_axis_v3_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('low_axis_v4_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('low_axis_v4_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('low_axis_v5_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [bookmarkedLawyerIds, setBookmarkedLawyerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('low_axis_v3_bookmarks');
    return saved ? JSON.parse(saved) : ['lawyer-1', 'lawyer-2'];
  });

  // Modals state
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [bookingLawyer, setBookingLawyer] = useState<Lawyer | null>(null);
  const [reviewLawyer, setReviewLawyer] = useState<Lawyer | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return conversations.length > 0 ? conversations[0].id : null;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('low_axis_v3_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('low_axis_v3_lawyers', JSON.stringify(lawyers));
  }, [lawyers]);

  useEffect(() => {
    localStorage.setItem('low_axis_v3_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('low_axis_v3_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('low_axis_v4_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('low_axis_v4_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('low_axis_v5_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('low_axis_v3_bookmarks', JSON.stringify(bookmarkedLawyerIds));
  }, [bookmarkedLawyerIds]);

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Bookmark toggle
  const toggleBookmark = (lawyerId: string) => {
    setBookmarkedLawyerIds((prev) =>
      prev.includes(lawyerId) ? prev.filter((id) => id !== lawyerId) : [...prev, lawyerId]
    );
  };

  // Add new appointment
  const addAppointment = (data: {
    lawyer: Lawyer;
    date: string;
    timeSlot: string;
    consultationMode: ConsultationMode;
    caseType: string;
    caseDescription: string;
    userName: string;
    userPhone: string;
    userEmail: string;
  }): Appointment => {
    let fee = data.lawyer.fees.inPerson;
    if (data.consultationMode === 'video_call') fee = data.lawyer.fees.videoCall;
    if (data.consultationMode === 'chat') fee = data.lawyer.fees.chat;

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      lawyerId: data.lawyer.id,
      lawyerName: data.lawyer.name,
      lawyerTitle: data.lawyer.title,
      lawyerAvatar: data.lawyer.avatar,
      lawyerLocation: data.lawyer.location,
      userId: 'user-001',
      userName: data.userName || 'Karan Sharma',
      userPhone: data.userPhone || '+91 98300-11223',
      userEmail: data.userEmail || 'karan@gmail.com',
      date: data.date,
      timeSlot: data.timeSlot,
      consultationMode: data.consultationMode,
      caseType: data.caseType,
      caseDescription: data.caseDescription,
      status: 'pending',
      fee: fee,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAppointments((prev) => [newApp, ...prev]);

    // Also start a chat thread if not exists
    startConversationWithLawyer(data.lawyer);

    return newApp;
  };

  // Update appointment status
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => {
      return prev.map((app) => {
        if (app.id === id) {
          if (status === 'confirmed') {
            addNotification({
              userId: app.userId,
              lawyerName: app.lawyerName,
              title: 'অ্যাপয়েন্টমেন্ট কনফার্মেশন (Appointment Confirmed)',
              message: `${app.lawyerName} আপনার অ্যাপয়েন্টমেন্ট বুকিং (${app.date}, ${app.timeSlot}) সফলভাবে কনফার্ম করেছেন।`,
              appointmentId: app.id,
            });
          }
          return { ...app, status };
        }
        return app;
      });
    });
  };

  // Submit Review & update Lawyer Rating
  const addReview = (data: {
    lawyerId: string;
    userName: string;
    rating: number;
    comment: string;
    consultationType?: string;
  }) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      lawyerId: data.lawyerId,
      userName: data.userName || 'Verified Client',
      rating: data.rating,
      comment: data.comment,
      date: new Date().toISOString().split('T')[0],
      consultationType: data.consultationType || 'Appointment Consultation',
      verifiedClient: true,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate lawyer rating & total reviews
    setLawyers((prevLawyers) =>
      prevLawyers.map((lawyer) => {
        if (lawyer.id === data.lawyerId) {
          const lawyerRevs = [newRev, ...reviews.filter((r) => r.lawyerId === data.lawyerId)];
          const avg =
            lawyerRevs.reduce((acc, r) => acc + r.rating, 0) / lawyerRevs.length;
          return {
            ...lawyer,
            rating: Math.round(avg * 100) / 100,
            totalReviews: lawyerRevs.length,
          };
        }
        return lawyer;
      })
    );
  };

  // Chat handling
  const startConversationWithLawyer = (lawyer: Lawyer): string => {
    const existing = conversations.find((c) => c.lawyerId === lawyer.id);
    if (existing) {
      setActiveConversationId(existing.id);
      return existing.id;
    }

    const newConvId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      lawyerTitle: lawyer.title,
      lawyerAvatar: lawyer.avatar,
      lawyerOnline: lawyer.availability.isOnlineNow,
      userId: 'user-001',
      userName: userProfile.name || 'Karan Sharma',
      lastMessage: 'Hello, I would like to seek legal consultation.',
      lastMessageTime: 'Just now',
      unreadCountUser: 0,
      unreadCountLawyer: 1,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newConvId]: [
        {
          id: `msg-${Date.now()}`,
          conversationId: newConvId,
          senderRole: 'user',
          text: 'Hello, I would like to seek legal consultation.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));

    setActiveConversationId(newConvId);
    return newConvId;
  };

  const markConversationAsRead = (conversationId: string, forRole: 'user' | 'lawyer') => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCountUser: forRole === 'user' ? 0 : conv.unreadCountUser,
            unreadCountLawyer: forRole === 'lawyer' ? 0 : conv.unreadCountLawyer,
          };
        }
        return conv;
      })
    );
  };

  const sendMessage = (conversationId: string, text: string, senderRole: 'user' | 'lawyer') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text,
            lastMessageTime: 'Just now',
            unreadCountUser: senderRole === 'user' ? 0 : conv.unreadCountUser + 1,
            unreadCountLawyer: senderRole === 'lawyer' ? 0 : conv.unreadCountLawyer + 1,
          };
        }
        return conv;
      })
    );

    // Auto-respond from lawyer if user sent message (simulated real-time chat response)
    if (senderRole === 'user') {
      setTimeout(() => {
        const autoReplies = [
          'Thank you for messaging. I reviewed your case details. I will examine the matter and update you shortly.',
          'We are giving high priority to your matter. If needed, please share a scanned copy of your documents in chat or book an appointment.',
          'Greetings. I was busy with chamber activities. If you have an urgent bail or writ petition, please let me know immediately.',
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          conversationId,
          senderRole: 'lawyer',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: randomReply,
                  lastMessageTime: 'Just now',
                  unreadCountUser: conv.unreadCountUser + 1,
                }
              : conv
          )
        );
      }, 1500);
    }
  };

  // User updates profile
  const updateUserProfile = (updated: Partial<UserProfileData>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Lawyer updates profile
  const updateLawyerProfile = (updated: Partial<Lawyer>) => {
    setLawyers((prev) =>
      prev.map((l) => (l.id === currentLawyerId ? { ...l, ...updated } : l))
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        userTab,
        setUserTab,
        lawyerTab,
        setLawyerTab,
        userProfile,
        updateUserProfile,
        lawyers,
        reviews,
        appointments,
        conversations,
        messages,
        notifications,
        clearAllNotifications,
        markNotificationsAsRead,
        addNotification,
        selectedLawyer,
        setSelectedLawyer,
        bookingLawyer,
        setBookingLawyer,
        reviewLawyer,
        setReviewLawyer,
        currentLawyerId,
        setCurrentLawyerId,
        activeConversationId,
        setActiveConversationId,
        addAppointment,
        updateAppointmentStatus,
        addReview,
        sendMessage,
        markConversationAsRead,
        startConversationWithLawyer,
        updateLawyerProfile,
        toggleBookmark,
        bookmarkedLawyerIds,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
