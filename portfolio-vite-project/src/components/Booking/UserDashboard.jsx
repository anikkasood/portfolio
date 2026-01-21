import { useState, useEffect } from 'react';

export default function UserDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('create');
  const [myBookings, setMyBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [formData, setFormData] = useState({ 
    date: '', time: '', vision: '', clientPhone: '', questions: '' 
  });

  useEffect(() => {
    fetchBookings();
    fetchAvail();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/user/${user.userId}`);
      setMyBookings(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchAvail = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/availability');
      setAvailabilities(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) return alert("Select date & time");
    
    await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.userId,
        clientName: user.name,
        clientEmail: user.email,
        ...formData
      })
    });
    setFormData({ date: '', time: '', vision: '', clientPhone: '', questions: '' });
    setActiveTab('manage');
  };

  const currentDayTimes = availabilities.find(a => a.date === formData.date)?.times || [];

  return (
    <div className="flex flex-col h-full bg-white select-none">
      <div className="flex justify-center p-3 border-b bg-slate-50/50 backdrop-blur-sm">
        <div className="flex bg-gray-200 p-1 rounded-lg w-full max-w-[280px]">
          <button onClick={() => setActiveTab('create')} 
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'create' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            NEW SESSION
          </button>
          <button onClick={() => setActiveTab('manage')} 
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeTab === 'manage' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            MY BOOKINGS
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'create' ? (
          <form onSubmit={handleBooking} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tight">Date</label>
                <input type="date" value={formData.date} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100" onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tight">Phone</label>
                <input type="tel" placeholder="000-000-0000" value={formData.clientPhone} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100" onChange={e => setFormData({...formData, clientPhone: e.target.value})} />
              </div>
            </div>
            
            {formData.date && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tight">Available Times</label>
                <div className="grid grid-cols-3 gap-2">
                  {currentDayTimes.map(t => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, time: t})}
                      className={`p-2.5 rounded-lg border text-[11px] font-bold transition-all ${formData.time === t ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tight">Your Vision</label>
              <textarea placeholder="Vibe, outfits, location..." value={formData.vision} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 text-sm outline-none resize-none" onChange={e => setFormData({...formData, vision: e.target.value})} />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tight">Any Questions?</label>
              <input type="text" placeholder="Ask away..." value={formData.questions} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, questions: e.target.value})} />
            </div>

            <button disabled={!formData.time} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95">Request Booking</button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {myBookings.length > 0 ? myBookings.map(b => (
              <div key={b.bookingId} className={`p-5 border rounded-2xl bg-white shadow-sm ${b.status === 'canceled' ? 'opacity-75 grayscale-[0.5]' : 'border-slate-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{b.slot}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Created {new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                    b.status === 'approved' ? 'bg-green-50 text-green-600' : 
                    b.status === 'canceled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-xs">📱</span>
                    <p className="text-[11px] font-medium">{b.clientPhone || "No phone provided"}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Your Vision</span>
                    <p className="text-[11px] text-slate-600 italic">"{b.vision || "No vision notes"}"</p>
                  </div>

                  {b.questions && (
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <span className="block text-[9px] font-bold text-blue-400 uppercase mb-1">Your Questions</span>
                      <p className="text-[11px] text-slate-600">{b.questions}</p>
                    </div>
                  )}
                </div>

                {/* Conditional Button Rendering */}
                {b.status !== 'canceled' && (
                  <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
                    <button 
                      onClick={async () => { 
                        if(window.confirm("Cancel this booking request?")) { 
                          await fetch(`http://localhost:5000/api/bookings/${b.bookingId}`, { 
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'canceled' })
                          }); 
                          fetchBookings(); 
                        } 
                      }} 
                      className="text-red-400 text-[10px] font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      CANCEL REQUEST
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm italic font-medium">No bookings found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}