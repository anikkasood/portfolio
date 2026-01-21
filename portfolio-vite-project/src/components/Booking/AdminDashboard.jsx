import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [availDate, setAvailDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const timeSlots = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

  useEffect(() => { if (activeTab === 'all') fetchAll(); }, [activeTab]);

  const fetchAll = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/admin');
      const data = await res.json();
      // Sort bookings by date so newest or upcoming are easier to find
      const sortedData = (data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
      setBookings(sortedData);
    } catch (e) { setBookings([]); }
  };

  const handleUpdate = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const handleSaveAvail = async () => {
    if (!availDate) return alert("Select Date");
    await fetch('http://localhost:5000/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: availDate, times: selectedTimes })
    });
    alert("Updated!");
  };

  const toggleTime = (t) => {
    setSelectedTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  // Helper to format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "No Date";
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex justify-center p-3 border-b bg-slate-900 shadow-xl">
        <div className="flex bg-white/10 p-1 rounded-xl w-full max-w-[320px]">
          <button onClick={() => setActiveTab('all')} className={`flex-1 py-2 text-[11px] font-bold rounded-lg ${activeTab === 'all' ? 'bg-white text-slate-900' : 'text-white/60'}`}>ALL BOOKINGS</button>
          <button onClick={() => setActiveTab('avail')} className={`flex-1 py-2 text-[11px] font-bold rounded-lg ${activeTab === 'avail' ? 'bg-white text-slate-900' : 'text-white/60'}`}>SET SLOTS</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'all' ? (
          <div className="space-y-4">
            {bookings.length > 0 ? bookings.map(b => (
              <div key={b.bookingId} className="p-5 border-2 rounded-2xl border-slate-50 shadow-sm bg-white hover:border-blue-100 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 tracking-tight">{b.clientName}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                       {/* Prominent Date & Time Display */}
                      <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {formatDate(b.date)}
                      </span>
                      <span className="text-[12px] font-bold text-slate-700">
                        @ {b.time || "No Time"}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                    b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-4 border-y border-slate-50 py-3">
                  <p className="flex items-center gap-1">📧 <span className="truncate">{b.clientEmail}</span></p>
                  <p className="flex items-center gap-1">📱 <span>{b.clientPhone || 'N/A'}</span></p>
                </div>

                {b.vision && (
                  <div className="bg-slate-50 p-3 rounded-xl mb-2 text-[11px] border border-slate-100">
                    <span className="font-bold text-slate-400 block uppercase text-[9px] mb-1">Vision & Concept:</span>
                    <p className="text-slate-700 italic">"{b.vision}"</p>
                  </div>
                )}

                {b.questions && (
                  <div className="bg-blue-50/30 p-3 rounded-xl mb-4 text-[11px] border border-blue-100">
                    <span className="font-bold text-blue-400 block uppercase text-[9px] mb-1">Client Questions:</span>
                    <p className="text-slate-700">{b.questions}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(b.bookingId, 'approved')} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">Approve</button>
                  <button onClick={() => handleUpdate(b.bookingId, 'canceled')} className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[11px] font-bold hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200">Cancel</button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No requests found</p>
                <p className="text-slate-300 text-[11px] mt-1 italic font-medium">Wait for clients to book sessions.</p>
              </div>
            )}
          </div>
        ) : (
          /* Set Slots Tab */
          <div className="space-y-6 animate-in fade-in">
             <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Select Target Date</label>
              <input type="date" className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium" onChange={e => setAvailDate(e.target.value)} />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Toggle Availability</label>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map(t => (
                  <button key={t} onClick={() => toggleTime(t)} className={`p-4 rounded-2xl border-2 text-[12px] font-bold transition-all ${selectedTimes.includes(t) ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSaveAvail} disabled={!availDate} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-black active:scale-95 transition-all disabled:opacity-30">Update Available Slots</button>
          </div>
        )}
      </div>
    </div>
  );
}