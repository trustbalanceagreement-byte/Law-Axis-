import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, CheckCircle2, XCircle, Phone, Mail, User, FileText } from 'lucide-react';
import { AppointmentStatus } from '../../types';

export const LawyerAppointments: React.FC = () => {
  const {
    currentLawyerId,
    appointments,
    updateAppointmentStatus,
    language,
    t,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const lawyerApps = appointments.filter((a) => {
    if (a.lawyerId !== currentLawyerId) return false;
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-20 text-slate-800">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>{t('অ্যাপয়েন্টমেন্ট ও কেস ম্যানেজমেন্ট', 'Client Appointment Schedule')}</span>
            </h1>
            <p className="text-xs text-slate-500">
              {t('আপনার চেম্বার ও অনলাইন কনসালটেশনের সময়সূচি এবং ক্লায়েন্ট লিস্ট', 'Manage client booking requests and consultation status')}
            </p>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg border font-bold capitalize shrink-0 transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {lawyerApps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">{t('কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি', 'No Appointments Found')}</h3>
          <p className="text-xs text-slate-500">{t('পেন্ডিং বা নিশ্চিত কোনো রিকোয়েস্ট নেই।', 'No bookings matching selected status filter.')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lawyerApps.map((app) => (
            <div
              key={app.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.userName}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                      {app.consultationMode.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('বুকিং আইডি:', 'Booking ID:')} <span className="font-mono text-indigo-600 font-bold">{app.id}</span> • {t('তারিখ:', 'Created:')} {app.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      app.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : app.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : app.status === 'completed'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Appointment Body Grid */}
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block uppercase tracking-wider">{t('সময়সূচী ও স্থান', 'Schedule & Location')}</span>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">{t('নির্ধারিত তারিখ:', 'Date:')}</span>
                    <span className="font-semibold text-slate-900">{app.date}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">{t('সময় স্লট:', 'Time Slot:')}</span>
                    <span className="font-semibold text-slate-900">{app.timeSlot}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">{t('কনসালটেশন ফি:', 'Consultation Fee:')}</span>
                    <span className="font-black text-indigo-600">₹{app.fee}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block uppercase tracking-wider">{t('ক্লায়েন্টের তথ্য ও যোগাযোগের উপায়', 'Client Info')}</span>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">{t('মোবাইল নম্বর:', 'Phone:')}</span>
                    <a href={`tel:${app.userPhone}`} className="font-semibold text-indigo-600 hover:underline">
                      {app.userPhone}
                    </a>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">{t('ইমেইল:', 'Email:')}</span>
                    <span className="font-semibold text-slate-900">{app.userEmail}</span>
                  </div>
                </div>
              </div>

              {/* Case Note */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">
                  {t('মামলার ধরন ও সংক্ষেপ নোট:', 'Case Description:')} <strong className="text-indigo-600">{app.caseType}</strong>
                </span>
                <p className="italic text-slate-600">{app.caseDescription || 'No additional notes provided.'}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                {app.status === 'pending' && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {t('বুকিং গ্রহণ করুন', 'Confirm Booking')}
                  </button>
                )}

                {app.status === 'confirmed' && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'completed')}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {t('পরামর্শ সম্পন্ন চিহ্নিত করুন', 'Mark as Completed')}
                  </button>
                )}

                {app.status !== 'cancelled' && app.status !== 'completed' && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs transition-colors border border-slate-200"
                  >
                    {t('বাতিল করুন', 'Cancel Request')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
