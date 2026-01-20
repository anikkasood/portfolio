import { useState } from 'react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([
    { id: 1, client: "John Doe", date: "2026-02-14", time: "14:00", type: "Portrait" },
    { id: 2, client: "Jane Smith", date: "2026-02-15", time: "10:00", type: "Concert" },
  ]);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Upcoming Appointments</h3>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">{booking.client}</p>
              <p className="text-xs text-gray-500">{booking.date} at {booking.time} • {booking.type}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-100">Reschedule</button>
              <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}