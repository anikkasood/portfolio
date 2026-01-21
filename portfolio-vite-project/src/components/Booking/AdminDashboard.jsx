import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [availDate, setAvailDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  
  const timeSlots = [
    "9:00 AM - 10:00 AM", "10:30 AM - 11:30 AM", 
    "12:00 PM - 1:00 PM", "1:30 PM - 2:30 PM", 
    "3:00 PM - 4:00 PM", "4:30 PM - 5:30 PM", 
    "6:00 PM - 7:00 PM"
  ];

  useEffect(() => {
    if (activeTab === 'all') fetchAllBookings();
    if (activeTab === 'view-avail') fetchAllAvail();
  }, [activeTab]);

  const fetchAllBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/admin');
      const data = await res.json();
      setBookings((data || []).sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (e) { setBookings([]); }
  };

  const fetchAllAvail = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/availability');
      const data = await res.json();
      const cleanedData = (data || []).map(item => ({
        ...item,
        times: Array.isArray(item.times) 
          ? item.times.map(t => typeof t === 'object' ? t.S : t) 
          : []
      }));
      setAvailabilities(cleanedData.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (e) { 
      console.error("Fetch Avail Error:", e);
      setAvailabilities([]); 
    }
  };

  const handleUpdate = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAllBookings();
  };

  const handleSaveAvail = async () => {
    if (!availDate) return alert("Select Date");
    await fetch('http://localhost:5000/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: availDate, times: selectedTimes })
    });
    alert("Updated!");
    setSelectedTimes([]);
    setAvailDate('');
    if (activeTab === 'view-avail') fetchAllAvail();
  };

  const handleDeleteAvail = async (date) => {
    if (!confirm(`Delete all slots for ${date}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/availability/${encodeURIComponent(date)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setAvailabilities(prev => prev.filter(a => a.date !== date));
      } else {
        alert("Server failed to delete.");
      }
    } catch (e) {
      alert("Could not connect to the server.");
    }
  };

  const toggleTime = (t) => {
    setSelectedTimes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const groupedAvail = availabilities.reduce((acc, curr) => {
    if (!curr.date) return acc;
    const dateObj = new Date(curr.date + 'T00:00:00');
    const month = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(curr);
    return acc;
  }, {});

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.toLocaleDateString('en-US', { day: 'numeric' })
    };
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1D1D1F] font-sans antialiased pb-12">
      <div className="max-w-2xl mx-auto pt-10 px-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-end space-x-1">
          {['all', 'avail', 'view-avail'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-4 py-4 text-[13px] font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-white text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#0071E3] after:rounded-t-full' 
                : 'text-[#86868B] hover:text-black'
              }`}
            >
              {tab === 'all' ? 'Bookings' : tab === 'avail' ? 'Add Availability' : 'Current Availability'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-gray-200 shadow-sm p-6">
          
          {/* TAB: BOOKINGS (Updated to show all form fields) */}
          {activeTab === 'all' && (
            <div className="space-y-4 animate-in fade-in">
              {bookings.length > 0 ? bookings.map(b => (
                <div key={b.bookingId} className="p-5 rounded-xl border border-gray-100 shadow-sm bg-[#FBFBFD]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-md font-bold">{b.clientName}</h3>
                      <p className="text-[12px] text-[#86868B] font-medium">{b.clientEmail}</p>
                      <div className="mt-2">
                        <span className="text-[11px] text-[#0071E3] font-bold uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {new Date(b.date + 'T00:00:00').toLocaleDateString()} — {b.time}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase ${
                      b.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  {/* Detailed Form Content */}
                  <div className="space-y-3 py-4 border-y border-gray-50 text-[13px]">
                    <div>
                      <label className="text-[10px] font-black text-[#86868B] uppercase block mb-1">Phone Number</label>
                      <p className="font-semibold text-[#1D1D1F]">{b.clientPhone || "No phone provided"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#86868B] uppercase block mb-1">The Vision</label>
                      <p className="text-[#424245] leading-relaxed bg-white p-3 rounded-lg border border-gray-50 italic">
                        "{b.vision || "No vision provided"}"
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#86868B] uppercase block mb-1">Additional Questions</label>
                      <p className="text-[#424245]">{b.questions || "None"}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => handleUpdate(b.bookingId, 'approved')} className="flex-1 py-2.5 bg-[#0071E3] text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm shadow-blue-200">Accept Request</button>
                    <button onClick={() => handleUpdate(b.bookingId, 'canceled')} className="flex-1 py-2.5 bg-white text-[#FF3B30] border border-gray-100 rounded-xl text-xs font-bold active:scale-95 transition-all">Cancel</button>
                  </div>
                </div>
              )) : <p className="text-center py-20 text-[#86868B]">No bookings.</p>}
            </div>
          )}


          {activeTab === 'avail' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#86868B] uppercase px-1">Target Date</label>
                <input type="date" value={availDate} className="w-full p-3 bg-[#FBFBFD] border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0071E3] outline-none" onChange={e => setAvailDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timeSlots.map(t => (
                  <button key={t} onClick={() => toggleTime(t)} className={`relative py-3 px-4 rounded-xl text-[12px] font-bold border transition-all ${selectedTimes.includes(t) ? 'bg-[#0071E3] text-white border-[#0071E3]' : 'bg-white text-[#1D1D1F] border-gray-200'}`}>
                    {t} {selectedTimes.includes(t) && <span className="absolute -top-1 -right-1 bg-white text-[#0071E3] rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-black shadow-sm">✔</span>}
                  </button>
                ))}
              </div>
              <button onClick={handleSaveAvail} disabled={!availDate} className={`w-full py-4 rounded-xl font-bold ${availDate ? 'bg-[#0071E3] text-white' : 'bg-[#E5E5E7] text-[#A1A1A6]'}`}>Save Availability</button>
            </div>
          )}

          {/* TAB: VIEW ALL AVAILABILITY (CALENDAR VIEW) */}
          {activeTab === 'view-avail' && (
            <div className="space-y-10 animate-in fade-in">
              {Object.keys(groupedAvail).length > 0 ? Object.entries(groupedAvail).map(([month, days]) => (
                <div key={month} className="space-y-6">
                  <h2 className="text-[13px] font-black text-[#0071E3] uppercase tracking-widest border-l-4 border-[#0071E3] pl-3">
                    {month}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {days.map((avail, idx) => {
                      const { dayName, dayNum } = formatDateLabel(avail.date);
                      return (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col items-center justify-center min-w-[64px] h-[64px] bg-[#F2F2F7] rounded-xl border border-gray-200 overflow-hidden">
                            <div className="w-full bg-[#0071E3] py-1 flex justify-center">
                                <span className="text-[9px] font-black text-white uppercase">{dayName}</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <span className="text-2xl font-black text-[#1D1D1F]">{dayNum}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 overflow-hidden">
                            <div className="flex flex-wrap gap-1.5">
                              {avail.times.map((t, tIdx) => (
                                <span key={tIdx} className="text-[9px] bg-blue-50 text-[#0071E3] px-2 py-0.5 rounded border border-blue-100 font-bold uppercase tracking-tighter">
                                  {t.split(' - ')[0]}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={() => handleDeleteAvail(avail.date)}
                            className="p-2 text-[#86868B] hover:text-[#FF3B30] hover:bg-red-50 rounded-full transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )) : <p className="text-center py-20 text-[#86868B]">No availability set.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}