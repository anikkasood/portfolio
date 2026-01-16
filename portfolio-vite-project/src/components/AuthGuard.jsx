import React from 'react';

export default function AuthGuard({ onLogin }) {
  // Simple mock login for frontend development
  const handleMockLogin = () => {
    onLogin({ name: "Anika Sood", email: "asood008@ucr.edu", isAdmin: true });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <span className="text-2xl">🔐</span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Login Required</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-[240px]">
        Please sign in with your Google account to manage or view reservations.
      </p>
      <button 
        onClick={handleMockLogin}
        className="flex items-center gap-3 px-6 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all active:scale-95"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-5 h-5" />
        <span className="text-sm font-semibold text-gray-700">Sign in with Google</span>
      </button>
    </div>
  );
}