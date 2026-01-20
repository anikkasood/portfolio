import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function BookingWindow() {
  const [user, setUser] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

  useEffect(() => {
    const savedUser = localStorage.getItem('portfolio_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('portfolio_user', JSON.stringify(data.user));
        localStorage.setItem('portfolio_token', data.sessionToken);
      }
    } catch (err) { console.error("Login failed", err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_user');
    localStorage.removeItem('portfolio_token');
    setUser(null);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime || !selectedDate) return alert("Please select both date and time");
    
    setBookingStatus('loading');
    const formData = new FormData(e.currentTarget); // use currentTarget for accuracy
    
    const bookingData = {
      userId: user.userId,
      clientName: formData.get('clientName'),
      clientPhone: formData.get('clientPhone'),
      clientEmail: formData.get('clientEmail'),
      peopleCount: formData.get('peopleCount'),
      slot: `${selectedDate} at ${selectedTime}`,
      vision: formData.get('vision'),
      questions: formData.get('questions'),
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) setBookingStatus('success');
    } catch (err) {
      setBookingStatus('idle');
      alert("Booking failed. Check backend.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">📅</div>
        <h2 className="text-lg font-semibold mb-1">Book a Session</h2>
        <p className="text-gray-500 mb-6 text-sm">Sign in with Google to view availability.</p>
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
      </div>
    );
  }

  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 text-xl">✓</div>
        <h2 className="text-lg font-semibold mb-1">Request Sent</h2>
        <p className="text-gray-500 mb-4 text-sm">I'll reach out to confirm your session shortly!</p>
        <button onClick={() => {setBookingStatus('idle'); setSelectedDate(''); setSelectedTime('');}} className="text-blue-600 text-sm font-medium hover:underline">Book another</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white text-[13px] text-slate-900">
      <div className="px-5 py-3 border-b flex items-center justify-between shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <img src={user.picture} alt="" className="w-6 h-6 rounded-full border border-white" />
          <span className="font-medium">{user.name}</span>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 text-xs transition-colors">Logout</button>
      </div>

      <form onSubmit={handleBooking} className="p-5 space-y-6 overflow-y-auto">
        {/* Date Selection */}
        <div>
          <label className="block font-bold text-slate-500 mb-2 uppercase text-[10px] tracking-wider">1. Select Date</label>
          <input 
            type="date" 
            required
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Time Selection - FIXING COLOR LOGIC HERE */}
        {selectedDate && (
          <div className="animate-in fade-in duration-300">
            <label className="block font-bold text-slate-500 mb-2 uppercase text-[10px] tracking-wider">2. Available Times</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-center ${
                    selectedTime === time 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <label className="block font-bold text-slate-500 uppercase text-[10px] tracking-wider">3. Your Information</label>
          
          <div className="grid grid-cols-2 gap-3">
            <input name="clientName" defaultValue={user.name} required placeholder="Name" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
            <input name="clientPhone" type="tel" placeholder="Phone" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input name="clientEmail" type="email" defaultValue={user.email} required placeholder="Email" className="col-span-2 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
            <input name="peopleCount" type="number" min="1" defaultValue="1" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
          </div>

          <textarea 
            name="vision" 
            placeholder="Tell me about your vision for the shoot (vibe, outfits)..." 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-24 outline-none focus:border-blue-500 resize-none"
          />

          <input 
            name="questions" 
            placeholder="Any questions?"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={bookingStatus === 'loading' || !selectedTime} 
          className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm shadow-blue-100"
        >
          {bookingStatus === 'loading' ? 'Sending Request...' : 'Confirm Request'}
        </button>
      </form>
    </div>
  );
}