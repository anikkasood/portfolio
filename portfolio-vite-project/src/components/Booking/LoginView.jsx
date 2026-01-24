export default function LoginView({ onLogin }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#F6F6F6]">
      <div className="w-16 h-16 bg-blue-500 rounded-2xl shadow-lg flex items-center justify-center text-3xl mb-6">
        
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Book a Photoshoot</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
        Sign in with Google to schedule a photoshoot or manage existing bookings.
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <button 
          onClick={() => onLogin(false)}
          className="w-full py-2.5 px-4 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-4 h-4" alt="Google" />
          Sign in with Google
        </button>
        
        {/* Admin Shortcut for testing */}
        <button 
          onClick={() => onLogin(true)}
          className="text-[10px] text-gray-400 hover:text-gray-600 underline"
        >
          Admin Login (Demo)
        </button>
      </div>
    </div>
  );
}