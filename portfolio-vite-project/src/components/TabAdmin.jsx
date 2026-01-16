import React from 'react';

export default function TabAdmin() {
  const allReservations = [
    { id: 101, user: "John Doe", date: "Jan 20", time: "9:00 AM", status: "Confirmed" },
    { id: 102, user: "Jane Smith", date: "Jan 21", time: "1:00 PM", status: "Pending" },
    { id: 103, user: "Bob Wilson", date: "Jan 22", time: "10:30 AM", status: "Confirmed" },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Admin Dashboard</h2>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">System Live</span>
      </div>

      <div className="overflow-hidden border border-gray-100 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-slate-400 text-[10px] uppercase font-bold">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Date/Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {allReservations.map(res => (
              <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-700">{res.user}</td>
                <td className="px-4 py-3 text-slate-500">{res.date}, {res.time}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    res.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {res.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}