import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

export default function BookingWindow() {
  const [user, setUser] = useState(null);
  const ADMIN_EMAIL = "asood008@ucr.edu";

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
      }
    } catch (err) { console.error("Login failed", err); }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-2xl">📅</div>
        <h2 className="text-lg font-semibold mb-1">Book a Session</h2>
        <p className="text-gray-500 mb-6 text-sm">Sign in with Google to manage bookings.</p>
        <GoogleLogin onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Shared Header */}
      <div className="px-5 py-2 border-b flex items-center justify-between shrink-0 bg-slate-50/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src={user.picture} alt="" className="w-5 h-5 rounded-full" />
          <span className="text-[12px] font-medium text-slate-700">{user.name} {user.email === ADMIN_EMAIL && "(Admin)"}</span>
        </div>
        <button onClick={() => { localStorage.clear(); setUser(null); }} className="text-slate-400 hover:text-red-500 text-[11px]">Logout</button>
      </div>

      {user.email === ADMIN_EMAIL ? <AdminDashboard /> : <UserDashboard user={user} />}
    </div>
  );
}