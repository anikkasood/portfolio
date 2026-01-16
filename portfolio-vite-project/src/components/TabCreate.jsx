import React, { useState } from 'react';

export default function TabCreate({ user, onLogin }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');

  const timeSlots = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Book a Session</h2>
        <p className="text-sm text-slate-500">Select a preferred date and time below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple Date Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Date</label>
          <input 
            type="date" 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Time Slots */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Times</label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map(time => (
              <button key={time} className="py-2 px-3 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!user ? (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
          <span className="text-amber-500">⚠️</span>
          <p className="text-xs text-amber-700 font-medium">You'll need to sign in to confirm this booking.</p>
        </div>
      ) : (
        <button className="w-full py-3 bg-[#007AFF] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:brightness-110 active:scale-[0.98] transition-all">
          Confirm Reservation
        </button>
      )}
    </div>
  );
}