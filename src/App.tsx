import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelectionGate } from './components/RoleSelectionGate';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';

// User views
import { UserHome } from './components/user/UserHome';
import { UserSearch } from './components/user/UserSearch';
import { UserChat } from './components/user/UserChat';
import { UserProfile } from './components/user/UserProfile';

// Lawyer views
import { LawyerDashboard } from './components/lawyer/LawyerDashboard';
import { LawyerAppointments } from './components/lawyer/LawyerAppointments';
import { LawyerChat } from './components/lawyer/LawyerChat';
import { LawyerProfileEdit } from './components/lawyer/LawyerProfileEdit';

// Modals
import { LawyerProfileModal } from './components/LawyerProfileModal';
import { BookingModal } from './components/BookingModal';
import { ReviewModal } from './components/ReviewModal';

const MainContent: React.FC = () => {
  const { role, userTab, lawyerTab } = useApp();

  // If no role selected yet (first visit), display the Role Selection Gate
  if (!role) {
    return <RoleSelectionGate />;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans overflow-x-hidden w-full max-w-full">
      {/* Persistent Top Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 md:p-8 overflow-hidden">
        {role === 'user' && (
          <>
            {userTab === 'home' && <UserHome />}
            {userTab === 'search' && <UserSearch />}
            {userTab === 'chat' && <UserChat />}
            {userTab === 'profile' && <UserProfile />}
          </>
        )}

        {role === 'lawyer' && (
          <>
            {lawyerTab === 'home' && <LawyerDashboard />}
            {lawyerTab === 'chat' && <LawyerChat />}
            {lawyerTab === 'appointments' && <LawyerAppointments />}
            {lawyerTab === 'profile' && <LawyerProfileEdit />}
          </>
        )}
      </main>

      {/* Persistent Bottom / Responsive Navigation */}
      <Navigation />

      {/* Global Interactive Modals */}
      <LawyerProfileModal />
      <BookingModal />
      <ReviewModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
