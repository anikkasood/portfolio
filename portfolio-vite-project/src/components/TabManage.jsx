import React from 'react';

export default function TabManage({ user }) {
  const myReservations = [
    { id: 1, date: "Jan 24, 2026", time: "2:30 PM", type: "Software Consultation" }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-slate-900">Your Reservations</h2>
      
      {myReservations.map(res => (
        <div key={res.id} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-slate-800">{res.type}</p>
            <p className="text-xs text-slate-500">{res.date} at {res.time}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              Reschedule
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}