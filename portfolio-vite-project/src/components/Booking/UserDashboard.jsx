import { useState, useEffect } from 'react';

export default function UserDashboard({ user, onOpenContact }) { // Added prop here
  const [activeTab, setActiveTab] = useState('how-to');
  const [myBookings, setMyBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [formData, setFormData] = useState({ 
    date: '', time: '', vision: '', clientPhone: '', questions: '' 
  });

  useEffect(() => {
    fetchMyBookings();
    fetchAvail();
    fetchAllBookings();
  }, [activeTab]);

  const fetchMyBookings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/user/${user.userId}`);
      const data = await res.json();
      setMyBookings(data || []);
    } catch (e) { console.error(e); }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/admin');
      const data = await res.json();
      setAllBookings(data || []);
    } catch (e) { console.error(e); }
  };

  const fetchAvail = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/availability');
      const data = await res.json();
      const cleanedData = (data || []).map(item => ({
        ...item,
        times: Array.isArray(item.times) 
          ? item.times.map(t => typeof t === 'object' ? t.S : t) 
          : []
      }));
      setAvailabilities(cleanedData);
    } catch (e) { console.error(e); }
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isFormValid) return alert("Please fill out all fields.");
    try {
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
    } catch (e) { alert("Booking failed. Try again."); }
  };

  const currentDayTimes = availabilities.find(a => a.date === formData.date)?.times || [];

  return (
    <div className="h-full bg-[#F2F2F7] text-[#1D1D1F] font-sans antialiased pb-12 overflow-y-auto">
      <div className="max-w-2xl mx-auto pt-6 px-6">
        
        <div className="flex items-end space-x-1">
          {['how-to', 'create', 'manage'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-6 py-4 text-sm font-bold transition-all duration-200 relative ${
                activeTab === tab 
                ? 'bg-white text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#0071E3] after:rounded-t-full' 
                : 'text-[#86868B] hover:text-black'
              }`}
            >
              {tab === 'how-to' ? 'How to' : tab === 'create' ? 'New Session' : 'My Bookings'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-gray-200 shadow-sm p-6 mb-10">
          
          {activeTab === 'how-to' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <div className="pb-2 border-b border-gray-100">
                <h2 className="text-xl font-bold tracking-tight">Thank you for your interest!</h2>
                <p className="text-[#86868B] text-sm leading-relaxed">
                  Follow these steps to book your photoshoot. Please contact me {' '}
                  <button 
                    onClick={onOpenContact} 
                    className="text-[#0071E3] font-bold hover:underline"
                  >
                    here
                  </button>
                  {' '} for more info, questions, and pricing details.
                </p>
              </div>
              
              <div className="grid gap-4">
                {[
                  { step: '01', title: 'Pick a Date & Time', desc: 'Select your preferred date/time from the "New Session" tab and tell me more about your shoot.' },
                  { step: '02', title: 'Check your email & send your deposit!', desc: 'You\'ll receive email confirmation of your booking request with instructions for the deposit.' },
                  { step: '03', title: 'Booking request will be approved', desc: ' Once deposit is received, your request will be accepted. Check the status on the "My Bookings" tab.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-[#FBFBFD] rounded-xl border border-gray-100">
                    <span className="text-[#0071E3] font-black text-lg">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-[#86868B] text-[13px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setActiveTab('create')}
                className="w-full py-4 bg-[#0071E3] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-[#0077ED] transition-all"
              >
                Get Started
              </button>
            </div>
          )}

          {activeTab === 'create' && (
            <form onSubmit={handleBooking} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#86868B] uppercase px-1">Date</label>
                  <input type="date" required value={formData.date} className="w-full p-3 bg-[#FBFBFD] border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0071E3] outline-none" onChange={e => setFormData({...formData, date: e.target.value, time: ''})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#86868B] uppercase px-1">Phone Number</label>
                  <input type="tel" required placeholder="(555) 000-0000" value={formData.clientPhone} className="w-full p-3 bg-[#FBFBFD] border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0071E3] outline-none" onChange={e => setFormData({...formData, clientPhone: e.target.value})} />
                </div>
              </div>

              {formData.date && (
                <div className="mt-4 animate-in fade-in duration-300">
                  <label className="text-[12px] font-bold text-[#86868B] uppercase block mb-4 px-1">Available Times</label>
                  {currentDayTimes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {currentDayTimes.map(t => {
                        const isTaken = allBookings.some(b => b.date === formData.date && b.time === t && b.status !== 'canceled' && b.status !== 'declined');
                        const isSelected = formData.time === t;
                        if (isTaken) return <div key={t} className="py-3 rounded-xl text-[12px] font-bold border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed text-center line-through">{t.split(' - ')[0]}</div>;
                        return (
                          <button key={t} type="button" onClick={() => setFormData({...formData, time: t})} className={`relative py-3 rounded-xl text-[12px] font-bold transition-all border ${isSelected ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-md scale-[1.02]' : 'bg-white text-[#1D1D1F] border-gray-200 hover:border-[#0071E3]'}`}>
                            {t.split(' - ')[0]}
                            {isSelected && <span className="absolute -top-1 -right-1 bg-white text-[#0071E3] rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-sm font-black">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  ) : <p className="text-sm text-[#FF3B30] font-medium px-1">No slots available for this date.</p>}
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#86868B] uppercase px-1">Your Vision</label>
                  <textarea required placeholder="Describe your shoot..." value={formData.vision} className="w-full p-4 bg-[#FBFBFD] border border-gray-200 rounded-xl h-28 text-sm focus:ring-2 focus:ring-[#0071E3] outline-none resize-none" onChange={e => setFormData({...formData, vision: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-[#86868B] uppercase px-1">Questions</label>
                  <input type="text" required placeholder="Any questions?" value={formData.questions} className="w-full p-3 bg-[#FBFBFD] border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0071E3] outline-none" onChange={e => setFormData({...formData, questions: e.target.value})} />
                </div>
              </div>

              <button disabled={!isFormValid || !formData.time} className={`w-full py-4 rounded-xl font-bold text-[16px] transition-all ${(isFormValid && formData.time) ? 'bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-lg' : 'bg-[#E5E5E7] text-[#A1A1A6] cursor-not-allowed'}`}>Request Session</button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-4 animate-in fade-in">
              {myBookings.length > 0 ? myBookings.map(b => (
                <div key={b.bookingId} className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-md font-bold text-[#1D1D1F]">{b.slot}</h3>
                      <p className="text-[11px] text-[#86868B] font-medium uppercase">Requested {new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded border ${b.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>{b.status.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                    <span className="text-[13px] font-medium text-[#86868B]">📱 {b.clientPhone}</span>
                    <button onClick={async () => { if(window.confirm("Cancel?")) { await fetch(`http://localhost:5000/api/bookings/${b.bookingId}`, { method: 'DELETE' }); fetchMyBookings(); fetchAllBookings(); } }} className="text-[#FF3B30] text-[12px] font-bold hover:underline">Cancel Request</button>
                  </div>
                </div>
              )) : <div className="text-center py-20 bg-[#FBFBFD] rounded-xl border-2 border-dashed border-gray-200"><p className="text-[#86868B] text-sm font-medium">No bookings.</p></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}