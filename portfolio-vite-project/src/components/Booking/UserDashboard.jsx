import { useState } from 'react';

export default function UserDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('reserve');

  return (
    <div className="flex flex-col h-full">
      {/* macOS style Segmented Control */}
      <div className="flex justify-center p-4 bg-white">
        <div className="flex bg-gray-100 p-1 rounded-lg w-full max-w-[300px]">
          <button 
            onClick={() => setActiveTab('reserve')}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'reserve' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            New Reservation
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'manage' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            My Bookings
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {activeTab === 'reserve' ? (
          <form className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Session Type</label>
              <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Portrait Session</option>
                <option>Concert Photography</option>
                <option>Fashion Editorial</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Preferred Date</label>
              <input type="date" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
            </div>
            <button type="button" className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">
              Request Appointment
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
             <span className="text-4xl mb-2">📁</span>
             <p className="text-sm">No active bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}