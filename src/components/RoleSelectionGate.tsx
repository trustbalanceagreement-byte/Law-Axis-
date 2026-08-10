import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Scale } from 'lucide-react';
import { motion } from 'motion/react';

export const RoleSelectionGate: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Dimmed Platform Preview */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden flex flex-col justify-between p-6 blur-[1px]">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="text-xl font-bold font-serif text-blue-900">Law Axis</div>
          <div className="text-xs text-slate-500">Dhaka, Bangladesh</div>
        </div>
        <div className="max-w-xl mx-auto text-center my-auto space-y-4">
          <div className="text-2xl font-extrabold text-slate-800">Find Top Lawyers</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200 text-slate-700">Adv. Mahbubur Rahman</div>
            <div className="bg-white/80 p-4 rounded-xl border border-slate-200 text-slate-700">Adv. Sadia Islam</div>
          </div>
        </div>
      </div>

      {/* Light Overlay Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white/90 to-slate-100/90 backdrop-blur-md" />

      {/* Main Content Modal Box Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center px-4"
      >
        {/* Brand Logo & Subtitle */}
        <div className="mb-8 sm:mb-10 flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-tight text-blue-950 drop-shadow-sm mb-2">
            Law Axis
          </h1>
          <p className="text-xs sm:text-sm text-blue-700/80 font-medium tracking-wide">
            Your Trusted Legal Partner
          </p>
        </div>

        {/* 2 Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full max-w-xl">
          {/* Card 1: User Role */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole('user')}
            className="cursor-pointer bg-white border border-slate-200/90 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200 shadow-sm">
              <User className="w-7 h-7 stroke-[1.75]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
              Go as a User
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Find Lawyers
            </p>
          </motion.div>

          {/* Card 2: Lawyer Role */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRole('lawyer')}
            className="cursor-pointer bg-white border border-slate-200/90 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200 shadow-sm">
              <Scale className="w-7 h-7 stroke-[1.75]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
              Go as a Lawyer
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Access Portal
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
